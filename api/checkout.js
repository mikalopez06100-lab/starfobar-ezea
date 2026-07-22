/* ══════════════════════════════════════════════════════════
   POST /api/checkout
   Crée une Stripe Checkout Session à partir du panier validé.
   Env requis :
     STRIPE_SECRET_KEY — clé secrète Stripe (sk_live_… / sk_test_…)
   Optionnel :
     SITE_URL — origine canonique (ex. https://starfobar.vercel.app)
   Si non configuré → 503 { error: 'not_configured' }
   ══════════════════════════════════════════════════════════ */

const CATALOG = {
  series: {
    sleeper: 'Old School BMW',
    racing: 'Racing Series',
    propaganda: 'Propaganda Series',
    marlboro: 'Marlboro Series',
  },
  prices: {
    single: 19000,
    duo: 34000,
    full: 68000,
    kit: 22900,
  },
  shipping: {
    fr: { label: 'France métropolitaine', amount: 990 },
    eu: { label: 'Union européenne', amount: 1990 },
    world: { label: 'International', amount: 2990 },
  },
  merch: {
    tshirt: 'T-shirt Starfobar',
    jersey: 'Jersey Starfobar',
    hoodie: 'Hoodie Starfobar',
  },
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
};

const SERIES_IDS = Object.keys(CATALOG.series);

const SHIP_COUNTRIES = [
  'FR', 'BE', 'CH', 'LU', 'DE', 'IT', 'ES', 'PT', 'NL', 'AT', 'IE', 'GB',
  'US', 'CA', 'AU', 'JP', 'MC', 'AD',
];

function bad(res, status, error) {
  return res.status(status).json({ error: error });
}

function originFromReq(req) {
  const fromEnv = process.env.SITE_URL && String(process.env.SITE_URL).replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  if (host) return proto + '://' + host;
  return 'https://starfobar.vercel.app';
}

function validateCart(body) {
  const type = body && body.type;
  const shipping = body && body.shipping;
  if (!type || !['single', 'duo', 'full', 'kit'].includes(type)) {
    return { error: 'Type de panier invalide.' };
  }
  if (!shipping || !CATALOG.shipping[shipping]) {
    return { error: 'Zone de livraison invalide.' };
  }

  const series = Array.isArray(body.series) ? body.series.map(String) : [];
  const merch = body.merch ? String(body.merch) : null;
  const size = body.size ? String(body.size).toUpperCase() : null;

  if (type === 'single') {
    if (series.length !== 1 || !SERIES_IDS.includes(series[0])) {
      return { error: 'Choisis une série.' };
    }
  }
  if (type === 'duo') {
    if (series.length !== 2 || series.some(function (s) { return !SERIES_IDS.includes(s); })) {
      return { error: 'Le duo nécessite 2 séries.' };
    }
  }
  if (type === 'kit') {
    if (series.length !== 1 || !SERIES_IDS.includes(series[0])) {
      return { error: 'Choisis une sculpture pour le kit.' };
    }
    if (!merch || !CATALOG.merch[merch]) {
      return { error: 'Choisis un textile.' };
    }
    if (!size || CATALOG.sizes.indexOf(size) === -1) {
      return { error: 'Choisis une taille.' };
    }
  }

  return {
    type: type,
    series: type === 'full' ? SERIES_IDS.slice() : series,
    merch: type === 'kit' ? merch : null,
    size: type === 'kit' ? size : null,
    shipping: shipping,
  };
}

function buildLineItems(cart) {
  const items = [];
  const amount = CATALOG.prices[cart.type];

  if (cart.type === 'single') {
    items.push({
      name: 'Sculpture ' + CATALOG.series[cart.series[0]],
      description: 'Édition limitée · 25 cm · numérotée',
      amount: amount,
    });
  } else if (cart.type === 'duo') {
    items.push({
      name: 'Duo Ezéa',
      description: cart.series.map(function (s) { return CATALOG.series[s]; }).join(' + '),
      amount: amount,
    });
  } else if (cart.type === 'full') {
    items.push({
      name: 'Full Collection',
      description: 'Propaganda · Racing · Old School BMW · Marlboro + coffret',
      amount: amount,
    });
  } else if (cart.type === 'kit') {
    items.push({
      name: 'Kit Starfobar',
      description: CATALOG.series[cart.series[0]] + ' + ' + CATALOG.merch[cart.merch] + ' · ' + cart.size,
      amount: amount,
    });
  }

  const ship = CATALOG.shipping[cart.shipping];
  items.push({
    name: 'Livraison — ' + ship.label,
    description: 'Frais de port',
    amount: ship.amount,
  });

  return items;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return bad(res, 405, 'Method not allowed');
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.warn('checkout: STRIPE_SECRET_KEY absent.');
    return bad(res, 503, 'not_configured');
  }

  const validated = validateCart(req.body || {});
  if (validated.error) return bad(res, 400, validated.error);

  const lineDefs = buildLineItems(validated);
  const origin = originFromReq(req);
  const total = lineDefs.reduce(function (s, it) { return s + it.amount; }, 0);

  const sessionBody = {
    mode: 'payment',
    success_url: origin + '/?checkout=success',
    cancel_url: origin + '/?checkout=cancel',
    billing_address_collection: 'required',
    locale: 'fr',
    'shipping_address_collection[allowed_countries]': SHIP_COUNTRIES,
    'metadata[type]': validated.type,
    'metadata[series]': validated.series.join(','),
    'metadata[merch]': validated.merch || '',
    'metadata[size]': validated.size || '',
    'metadata[shipping]': validated.shipping,
    'metadata[source]': 'starfobar',
    'payment_intent_data[metadata][type]': validated.type,
    'payment_intent_data[metadata][series]': validated.series.join(','),
    'payment_intent_data[metadata][merch]': validated.merch || '',
    'payment_intent_data[metadata][size]': validated.size || '',
    'payment_intent_data[metadata][shipping]': validated.shipping,
  };

  lineDefs.forEach(function (it, i) {
    const p = 'line_items[' + i + ']';
    sessionBody[p + '[quantity]'] = 1;
    sessionBody[p + '[price_data][currency]'] = 'eur';
    sessionBody[p + '[price_data][unit_amount]'] = it.amount;
    sessionBody[p + '[price_data][product_data][name]'] = it.name;
    if (it.description) {
      sessionBody[p + '[price_data][product_data][description]'] = it.description;
    }
  });

  try {
    const parts = [];
    Object.keys(sessionBody).forEach(function (key) {
      const val = sessionBody[key];
      if (Array.isArray(val)) {
        val.forEach(function (item, i) {
          parts.push(encodeURIComponent(key + '[' + i + ']') + '=' + encodeURIComponent(String(item)));
        });
      } else {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(val)));
      }
    });

    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + secret,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: parts.join('&'),
    });
    const data = await resp.json().catch(function () { return {}; });
    if (!resp.ok) {
      console.error('checkout Stripe error', resp.status, data);
      return bad(res, 502, (data && data.error && data.error.message) || 'Paiement indisponible.');
    }
    if (!data.url) return bad(res, 502, 'Session Stripe invalide.');
    return res.status(200).json({
      ok: true,
      url: data.url,
      id: data.id,
      total: total,
    });
  } catch (err) {
    console.error('checkout exception', err);
    return bad(res, 500, 'Erreur serveur.');
  }
};
