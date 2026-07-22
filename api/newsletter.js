/* ══════════════════════════════════════════════════════════
   POST /api/newsletter
   1) Envoie un email de confirmation via Resend
   2) (Optionnel) inscrit le contact dans une liste Brevo
   Env :
     RESEND_API_KEY, RESEND_FROM     — requis pour l'email
     BREVO_API_KEY, BREVO_LIST_ID    — optionnel (liste contacts)
   Si Resend non configuré → 503 { error: 'not_configured' }
   ══════════════════════════════════════════════════════════ */

const resend = require('../lib/resend');

async function addToBrevo(email, source) {
  const API_KEY = process.env.BREVO_API_KEY;
  const LIST_ID = process.env.BREVO_LIST_ID;
  if (!API_KEY || !LIST_ID) return { ok: true, skipped: true };

  const resp = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: email,
      listIds: [parseInt(LIST_ID, 10)],
      updateEnabled: true,
      attributes: { SOURCE: source || 'starfobar' },
    }),
  });

  if (resp.ok) return { ok: true };
  const data = await resp.json().catch(function () { return {}; });
  if (data && data.code === 'duplicate_parameter') return { ok: true, already: true };
  console.error('newsletter Brevo error', resp.status, data);
  return { ok: false, error: data };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source } = req.body || {};
  const clean = String(email || '').trim().toLowerCase();
  if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return res.status(400).json({ error: 'Email invalide.' });
  }

  if (!resend.isConfigured()) {
    console.warn('newsletter: RESEND_API_KEY / RESEND_FROM absents.');
    return res.status(503).json({ error: 'not_configured' });
  }

  try {
    const mail = resend.newsletterEmail(clean);
    const sent = await resend.sendEmail(mail);
    if (!sent.ok) {
      return res.status(502).json({ error: 'Envoi impossible.' });
    }

    // Liste contacts Brevo : best-effort (ne bloque pas si absente / en erreur)
    const list = await addToBrevo(clean, source).catch(function (err) {
      console.error('newsletter Brevo exception', err);
      return { ok: false };
    });

    return res.status(200).json({
      ok: true,
      emailed: true,
      listed: !!(list && list.ok && !list.skipped),
    });
  } catch (err) {
    console.error('newsletter exception', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};
