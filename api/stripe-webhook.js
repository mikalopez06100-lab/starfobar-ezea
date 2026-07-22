/* ══════════════════════════════════════════════════════════
   POST /api/stripe-webhook
   Écoute Stripe (checkout.session.completed) → email commande Resend.
   Env :
     STRIPE_SECRET_KEY
     STRIPE_WEBHOOK_SECRET   — whsec_… (endpoint Stripe)
     RESEND_API_KEY, RESEND_FROM
     ORDER_NOTIFY_TO         — optionnel, copie interne
   ══════════════════════════════════════════════════════════ */

const crypto = require('crypto');
const resend = require('../lib/resend');

// Corps brut requis pour vérifier la signature Stripe
module.exports.config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function timingSafeEqual(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** Vérifie la signature Stripe (schéma v1). */
function verifyStripeSignature(rawBody, header, secret) {
  if (!header || !secret) return null;
  const parts = String(header).split(',').map(function (p) { return p.trim(); });
  let timestamp = null;
  const signatures = [];
  parts.forEach(function (part) {
    const kv = part.split('=');
    if (kv[0] === 't') timestamp = kv[1];
    if (kv[0] === 'v1') signatures.push(kv[1]);
  });
  if (!timestamp || !signatures.length) return null;

  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
  if (Math.abs(age) > 300) return null; // 5 min

  const payload = timestamp + '.' + rawBody.toString('utf8');
  const expected = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
  const ok = signatures.some(function (sig) { return timingSafeEqual(sig, expected); });
  if (!ok) return null;

  try {
    return JSON.parse(rawBody.toString('utf8'));
  } catch (e) {
    return null;
  }
}

async function handleCheckoutCompleted(session) {
  const customerEmail =
    (session.customer_details && session.customer_details.email) ||
    session.customer_email ||
    null;

  if (!customerEmail) {
    console.warn('stripe-webhook: pas d\'email client sur la session', session.id);
    return { emailed: false, reason: 'no_customer_email' };
  }

  if (!resend.isConfigured()) {
    console.warn('stripe-webhook: Resend non configuré — email commande ignoré.');
    return { emailed: false, reason: 'resend_not_configured' };
  }

  const mail = resend.orderEmail({ to: customerEmail, session: session });
  const sent = await resend.sendEmail(mail);

  let notified = false;
  if (process.env.ORDER_NOTIFY_TO) {
    const notify = resend.orderNotifyEmail({ session: session, customerEmail: customerEmail });
    const n = await resend.sendEmail(notify);
    notified = !!(n && n.ok);
  }

  return { emailed: !!(sent && sent.ok), notified: notified, resendId: sent && sent.id };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('stripe-webhook: STRIPE_WEBHOOK_SECRET absent.');
    return res.status(503).json({ error: 'not_configured' });
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    console.error('stripe-webhook raw body', err);
    return res.status(400).json({ error: 'Invalid body' });
  }

  const event = verifyStripeSignature(
    rawBody,
    req.headers['stripe-signature'],
    secret
  );
  if (!event) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data && event.data.object;
      const result = await handleCheckoutCompleted(session || {});
      console.log('stripe-webhook checkout.session.completed', session && session.id, result);
      return res.status(200).json({ received: true, result: result });
    }

    // Autres events : ack silencieux
    return res.status(200).json({ received: true, ignored: event.type });
  } catch (err) {
    console.error('stripe-webhook exception', err);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
};
