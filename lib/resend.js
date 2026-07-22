/* ══════════════════════════════════════════════════════════
   Client Resend (transactionnel) — partagé par les routes API.
   Env :
     RESEND_API_KEY   — re_…
     RESEND_FROM      — "Starfobar × Ezéa <noreply@domaine.com>"
     ORDER_NOTIFY_TO  — (optionnel) email interne copie commande
                        défaut : contact@ezea.fr
   ══════════════════════════════════════════════════════════ */

const CONTACT_EMAIL = 'contact@ezea.fr';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isConfigured() {
  return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

async function sendEmail({ to, subject, html, text, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    return { ok: false, skipped: true, error: 'not_configured' };
  }

  const payload = {
    from: from,
    to: Array.isArray(to) ? to : [to],
    subject: subject,
    html: html,
    reply_to: replyTo || CONTACT_EMAIL,
  };
  if (text) payload.text = text;

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await resp.json().catch(function () { return {}; });
  if (!resp.ok) {
    console.error('resend error', resp.status, data);
    return { ok: false, error: (data && data.message) || 'send_failed', status: resp.status };
  }
  return { ok: true, id: data.id };
}

function layout({ title, bodyHtml }) {
  return (
    '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + escapeHtml(title) + '</title></head>' +
    '<body style="margin:0;padding:0;background:#0A0A0A;color:#F5F5F5;' +
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;\">" +
    '<div style="max-width:560px;margin:0 auto;padding:40px 24px;">' +
    '<div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;' +
    'color:#E30613;margin-bottom:28px;font-weight:700;">STARFOBAR × EZÉA</div>' +
    bodyHtml +
    '<div style="margin-top:40px;padding-top:20px;border-top:1px solid #2A2A2A;' +
    'font-size:12px;color:#888;line-height:1.6;">' +
    'Édition limitée · sculptures en résine numérotées.<br>' +
    '<a href="https://starfobarxezea.com" style="color:#F5F5F5;text-decoration:underline;">starfobarxezea.com</a>' +
    ' · <a href="mailto:contact@ezea.fr" style="color:#F5F5F5;">contact@ezea.fr</a>' +
    '</div></div></body></html>'
  );
}

function newsletterEmail(email) {
  const subject = 'Tu es dans la boucle — Starfobar × Ezéa';
  const html = layout({
    title: subject,
    bodyHtml:
      '<h1 style="font-size:28px;line-height:1.15;margin:0 0 16px;font-weight:700;">C\'est noté.</h1>' +
      '<p style="font-size:15px;line-height:1.7;color:#CFCFCF;margin:0 0 14px;">' +
      'Merci pour ton inscription. On te prévient quand une pièce part, quand une série ' +
      'touche à sa fin, ou quand la prochaine collab arrive.</p>' +
      '<p style="font-size:15px;line-height:1.7;color:#CFCFCF;margin:0 0 24px;">' +
      'Rien d\'autre. Pas de spam.</p>' +
      '<a href="https://starfobarxezea.com" style="display:inline-block;background:#E30613;color:#fff;' +
      'text-decoration:none;padding:14px 18px;font-size:12px;letter-spacing:2px;' +
      'text-transform:uppercase;font-weight:700;">Retourner dans le garage</a>',
  });
  const text =
    'C\'est noté.\n\n' +
    'Merci pour ton inscription à la newsletter Starfobar × Ezéa. ' +
    'On te prévient quand une pièce part ou quand la prochaine collab arrive.\n\n' +
    'https://starfobarxezea.com\n';
  return { to: email, subject: subject, html: html, text: text };
}

function formatEuroFromCents(cents) {
  const n = (Number(cents) || 0) / 100;
  return n.toFixed(2).replace('.', ',').replace(',00', '') + ' €';
}

function orderEmail({ to, session }) {
  const meta = (session && session.metadata) || {};
  const type = meta.type || 'commande';
  const series = meta.series || '';
  const merch = meta.merch || '';
  const size = meta.size || '';
  const shipping = meta.shipping || '';
  const amountTotal = session.amount_total;
  const sessionId = session.id || '';
  const customerName = (session.customer_details && session.customer_details.name) || '';

  const typeLabels = {
    single: 'Sculpture',
    duo: 'Duo Ezéa',
    full: 'Full Collection',
    kit: 'Kit Starfobar',
  };
  const shipLabels = {
    fr: 'France métropolitaine',
    eu: 'Union européenne',
    world: 'International',
  };

  const lines = [];
  lines.push('<strong style="color:#fff;">' + escapeHtml(typeLabels[type] || type) + '</strong>');
  if (series) lines.push('Séries : ' + escapeHtml(series.split(',').join(' · ')));
  if (merch) lines.push('Textile : ' + escapeHtml(merch) + (size ? ' · ' + escapeHtml(size) : ''));
  if (shipping) lines.push('Livraison : ' + escapeHtml(shipLabels[shipping] || shipping));
  if (amountTotal != null) lines.push('Total payé : ' + escapeHtml(formatEuroFromCents(amountTotal)));

  const subject = 'Commande confirmée — Starfobar × Ezéa';
  const hello = customerName ? ('Salut ' + escapeHtml(customerName) + ',') : 'Salut,';
  const html = layout({
    title: subject,
    bodyHtml:
      '<h1 style="font-size:28px;line-height:1.15;margin:0 0 16px;font-weight:700;">Commande confirmée.</h1>' +
      '<p style="font-size:15px;line-height:1.7;color:#CFCFCF;margin:0 0 18px;">' + hello +
      ' merci. Ton paiement est passé — on prépare ton envoi.</p>' +
      '<div style="background:#141414;border:1px solid #2A2A2A;padding:18px 16px;margin:0 0 22px;' +
      'font-size:14px;line-height:1.7;color:#CFCFCF;">' +
      lines.map(function (l) { return '<div style="margin:0 0 6px;">' + l + '</div>'; }).join('') +
      (sessionId
        ? '<div style="margin-top:12px;font-size:11px;color:#777;letter-spacing:1px;">REF · ' +
          escapeHtml(sessionId) + '</div>'
        : '') +
      '</div>' +
      '<p style="font-size:14px;line-height:1.7;color:#CFCFCF;margin:0;">' +
      'Tu recevras les infos de suivi dès l\'expédition. Question : ' +
      '<a href="mailto:contact@ezea.fr" style="color:#fff;">contact@ezea.fr</a>.</p>',
  });

  const text =
    'Commande confirmée — Starfobar × Ezéa\n\n' +
    (customerName ? 'Salut ' + customerName + ',\n\n' : 'Salut,\n\n') +
    'Ton paiement est passé. Récap :\n' +
    '- ' + (typeLabels[type] || type) + '\n' +
    (series ? '- Séries : ' + series + '\n' : '') +
    (merch ? '- Textile : ' + merch + (size ? ' · ' + size : '') + '\n' : '') +
    (shipping ? '- Livraison : ' + (shipLabels[shipping] || shipping) + '\n' : '') +
    (amountTotal != null ? '- Total : ' + formatEuroFromCents(amountTotal) + '\n' : '') +
    (sessionId ? '- Réf. : ' + sessionId + '\n' : '') +
    '\ncontact@ezea.fr\n';

  return { to: to, subject: subject, html: html, text: text };
}

function orderNotifyEmail({ session, customerEmail }) {
  const meta = (session && session.metadata) || {};
  const subject = '[Starfobar] Nouvelle commande — ' + (meta.type || 'order');
  const html = layout({
    title: subject,
    bodyHtml:
      '<h1 style="font-size:24px;margin:0 0 14px;">Nouvelle commande</h1>' +
      '<p style="font-size:14px;line-height:1.7;color:#CFCFCF;">' +
      'Client : ' + escapeHtml(customerEmail || '—') + '<br>' +
      'Type : ' + escapeHtml(meta.type || '—') + '<br>' +
      'Séries : ' + escapeHtml(meta.series || '—') + '<br>' +
      'Merch : ' + escapeHtml((meta.merch || '—') + (meta.size ? ' · ' + meta.size : '')) + '<br>' +
      'Livraison : ' + escapeHtml(meta.shipping || '—') + '<br>' +
      'Total : ' + escapeHtml(formatEuroFromCents(session.amount_total)) + '<br>' +
      'Session : ' + escapeHtml(session.id || '—') +
      '</p>',
  });
  return {
    to: process.env.ORDER_NOTIFY_TO || CONTACT_EMAIL,
    subject: subject,
    html: html,
    text: subject + '\n' + customerEmail + '\n' + JSON.stringify(meta),
  };
}

module.exports = {
  CONTACT_EMAIL: CONTACT_EMAIL,
  isConfigured: isConfigured,
  sendEmail: sendEmail,
  newsletterEmail: newsletterEmail,
  orderEmail: orderEmail,
  orderNotifyEmail: orderNotifyEmail,
};
