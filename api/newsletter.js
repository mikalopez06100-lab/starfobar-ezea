/* ══════════════════════════════════════════════════════════
   POST /api/newsletter
   Inscrit un email dans une liste Brevo (ex-Sendinblue).
   Env requis :
     BREVO_API_KEY   — clé API Brevo
     BREVO_LIST_ID   — id numérique de la liste (ex : starfobar-ezea-audience)
   Si non configuré → renvoie 503 { error: 'not_configured' } (le front
   affiche un message doux, aucune erreur bloquante).
   ══════════════════════════════════════════════════════════ */
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return res.status(400).json({ error: 'Email invalide.' });
  }

  const API_KEY = process.env.BREVO_API_KEY;
  const LIST_ID = process.env.BREVO_LIST_ID;
  if (!API_KEY || !LIST_ID) {
    // Non configuré : on ne bloque pas la mise en ligne.
    console.warn('newsletter: BREVO_API_KEY / BREVO_LIST_ID absents — inscription ignorée.');
    return res.status(503).json({ error: 'not_configured' });
  }

  try {
    const resp = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: String(email).trim().toLowerCase(),
        listIds: [parseInt(LIST_ID, 10)],
        updateEnabled: true,
        attributes: { SOURCE: source || 'starfobar' },
      }),
    });

    // Brevo renvoie 201 (créé) ou 204 (mis à jour). 400 "already associated" = déjà inscrit → OK.
    if (resp.ok) return res.status(200).json({ ok: true });

    const data = await resp.json().catch(() => ({}));
    if (data && data.code === 'duplicate_parameter') {
      return res.status(200).json({ ok: true, already: true });
    }
    console.error('newsletter Brevo error', resp.status, data);
    return res.status(502).json({ error: 'Inscription impossible.' });
  } catch (err) {
    console.error('newsletter exception', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};
