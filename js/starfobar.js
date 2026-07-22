/* ══════════════════════════════════════════════════════════
   Landing Starfobar × Ezéa — logique front
   - Panier → /api/checkout → Stripe Checkout
   - Modale galerie sculpture (clavier + swipe)
   - Capture newsletter (Brevo via /api/newsletter)
   - Hero vidéo avec fallback Ken Burns
   - Swipe auto des images produits (cartes)
   Aucune dépendance externe. Vanilla JS.
   ══════════════════════════════════════════════════════════ */
(function starfobar() {
  'use strict';

  /* ────────────────────────────────────────────────
     CONFIG — catalogue + livraison
     Les montants sont aussi revalidés côté serveur (/api/checkout).
     ──────────────────────────────────────────────── */
  var CONFIG = {
    price: 190,
    bundles: {
      duo: { price: 340, label: 'Duo Ezéa' },
      full: { price: 680, label: 'Full Collection' },
      kit: { price: 229, label: 'Kit Starfobar' },
    },
    shipping: {
      fr: { label: 'France métropolitaine', desc: 'Colissimo / Mondial Relay · 3–5 jours', amount: 9.9 },
      eu: { label: 'Union européenne', desc: 'Suivi international · 5–10 jours', amount: 19.9 },
      world: { label: 'International', desc: 'Hors UE · délais variables', amount: 29.9 },
    },
    merch: {
      tshirt: 'T-shirt Starfobar',
      jersey: 'Jersey Starfobar',
      hoodie: 'Hoodie Starfobar',
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // Détails affichés dans la modale « Voir les détails ».
    series: {
      sleeper: {
        title: 'Old School BMW',
        tag: 'SCULPTURE · OLD SCHOOL BMW',
        accent: '#C9A651',
        desc: "Inspirée de la culture BMW old school des années 70 à 90 : élégance discrète, préparations OEM+, garages privés et esprit « sleeper ». Une pièce collector, hommage à un héritage mécanique intemporel.",
        specs: [['Format', '25 cm'], ['Finition', 'Glossy premium · Or'], ['Matière', 'Résine et recyclage'], ['Origine', 'France · Lyon']],
        images: [
          '/assets/sculptures/sleeper/01-product.jpg?v=3',
          '/assets/sculptures/sleeper/02-detail-top.jpg?v=3',
          '/assets/sculptures/sleeper/03-detail-base.jpg?v=3',
          '/assets/sculptures/sleeper/04-packaging.jpg?v=3',
          '/assets/sculptures/sleeper/05-poster.jpg?v=3',
          '/assets/sculptures/sleeper/06-graphic.jpg?v=3',
          '/assets/sculptures/sleeper/07-collage.jpg?v=3',
          '/assets/sculptures/sleeper/08-garage.jpg?v=3',
          '/assets/sculptures/sleeper/09-garage-wide.jpg?v=3',
          '/assets/sculptures/sleeper/10-car.jpg?v=3',
        ],
      },
      racing: {
        title: 'Racing Series',
        tag: 'SCULPTURE · RACING',
        accent: '#3B82F6',
        desc: 'Inspirée des paddocks, des pit lanes et des légendes du sport automobile. Culture racing, mécanique et design performance — une véritable livrée collector.',
        specs: [['Format', '25 cm'], ['Finition', 'Glossy premium · Bleu'], ['Matière', 'Résine et recyclage'], ['Origine', 'France · Lyon']],
        images: [
          '/assets/sculptures/racing/01-product.jpg?v=3',
          '/assets/sculptures/racing/02-detail.jpg?v=3',
          '/assets/sculptures/racing/03-drip.jpg?v=3',
          '/assets/sculptures/racing/04-packaging.jpg?v=3',
          '/assets/sculptures/racing/05-poster.jpg?v=3',
          '/assets/sculptures/racing/06-graphic.jpg?v=3',
          '/assets/sculptures/racing/07-collage.jpg?v=3',
          '/assets/sculptures/racing/08-garage.jpg?v=3',
          '/assets/sculptures/racing/09-garage-wide.jpg?v=3',
          '/assets/sculptures/racing/10-car.jpg?v=3',
        ],
      },
      propaganda: {
        title: 'Propaganda Series',
        tag: 'SCULPTURE · PROPAGANDA',
        accent: '#EC4899',
        desc: 'Née dans la rue, inspirée des garages, des paddocks, des murs tagués et de la culture drift. Un univers brut, libre et sans filtre. Chaque bombe est une pièce unique, numérotée à la main.',
        specs: [['Format', '25 cm'], ['Finition', 'Glossy premium · Rose'], ['Matière', 'Résine et recyclage'], ['Origine', 'France · Lyon']],
        images: [
          '/assets/sculptures/propaganda/01-product.jpg?v=3',
          '/assets/sculptures/propaganda/02-detail.jpg?v=3',
          '/assets/sculptures/propaganda/03-melt.jpg?v=3',
          '/assets/sculptures/propaganda/04-packaging.jpg?v=3',
          '/assets/sculptures/propaganda/05-poster.jpg?v=3',
          '/assets/sculptures/propaganda/06-graphic.jpg?v=3',
          '/assets/sculptures/propaganda/07-collage.jpg?v=3',
          '/assets/sculptures/propaganda/08-garage-stack.jpg?v=3',
          '/assets/sculptures/propaganda/09-garage-wide.jpg?v=3',
          '/assets/sculptures/propaganda/10-car.jpg?v=3',
        ],
      },
      marlboro: {
        title: 'Marlboro Series',
        tag: 'SCULPTURE · MARLBORO',
        accent: '#E30613',
        desc: "Hommage à une époque où la vitesse était reine et où les légendes se créaient sur l'asphalte. Culture racing, pilotage et esprit de compétition.",
        specs: [['Format', '25 cm'], ['Finition', 'Glossy premium · Rouge'], ['Matière', 'Résine et recyclage'], ['Origine', 'France · Lyon']],
        images: [
          '/assets/sculptures/marlboro/01-product.jpg?v=3',
          '/assets/sculptures/marlboro/02-detail.jpg?v=3',
          '/assets/sculptures/marlboro/03-drip.jpg?v=3',
          '/assets/sculptures/marlboro/04-packaging.jpg?v=3',
          '/assets/sculptures/marlboro/05-poster.jpg?v=3',
          '/assets/sculptures/marlboro/06-graphic.jpg?v=3',
          '/assets/sculptures/marlboro/07-collage.jpg?v=3',
          '/assets/sculptures/marlboro/08-garage.jpg?v=3',
          '/assets/sculptures/marlboro/09-car-e30.jpg?v=3',
          '/assets/sculptures/marlboro/10-car.jpg?v=3',
        ],
      },
    },
  };

  var SERIES_ORDER = ['propaganda', 'racing', 'sleeper', 'marlboro'];

  /* ──────────── ANALYTICS (Vercel Web Analytics) ──────────── */
  function track(event, data) {
    try {
      if (typeof window.va === 'function') window.va('event', { name: event, data: data || {} });
    } catch (e) { /* no-op */ }
  }

  /* ──────────── TOAST ──────────── */
  var toastEl = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.setAttribute('role', 'status');
      toastEl.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:300;' +
        'background:#141414;border:1px solid #2A2A2A;border-left:3px solid #E30613;color:#fff;' +
        "padding:14px 20px;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:1px;" +
        'max-width:90vw;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.6);transition:opacity .3s;opacity:0;';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.style.opacity = '0'; }, 4200);
  }

  /* ──────────── CTAs → Panier ──────────── */
  function handleBuy(e) {
    var btn = e.currentTarget;
    e.preventDefault();
    var seriesId = btn.dataset.series;
    var bundleId = btn.dataset.bundle;
    var id = seriesId || bundleId;
    if (!id) return;
    track('cta_click', { item: id });
    if (bundleId) openCart({ type: bundleId });
    else openCart({ type: 'single', series: [seriesId] });
  }

  /* ──────────── PANIER ──────────── */
  var cartOverlay = document.getElementById('cartOverlay');
  var cartBody = document.getElementById('cartBody');
  var cartPayBtn = document.getElementById('cartPay');
  var cartState = {
    type: 'single',
    series: [],
    merch: null,
    size: null,
    shipping: 'fr',
  };
  var cartBusy = false;

  function euro(n) {
    var fixed = (Math.round(n * 100) / 100).toFixed(2).replace('.', ',');
    return fixed.replace(',00', '') + ' €';
  }

  function cartSubtotal() {
    if (cartState.type === 'single') return CONFIG.price;
    if (CONFIG.bundles[cartState.type]) return CONFIG.bundles[cartState.type].price;
    return 0;
  }

  function cartShippingAmount() {
    var s = CONFIG.shipping[cartState.shipping];
    return s ? s.amount : 0;
  }

  function cartTotal() {
    return cartSubtotal() + cartShippingAmount();
  }

  function cartIsValid() {
    if (!CONFIG.shipping[cartState.shipping]) return false;
    if (cartState.type === 'single') {
      return cartState.series.length === 1 && !!CONFIG.series[cartState.series[0]];
    }
    if (cartState.type === 'duo') {
      return cartState.series.length === 2 &&
        cartState.series.every(function (s) { return !!CONFIG.series[s]; });
    }
    if (cartState.type === 'full') return true;
    if (cartState.type === 'kit') {
      return cartState.series.length === 1 &&
        !!CONFIG.series[cartState.series[0]] &&
        !!CONFIG.merch[cartState.merch] &&
        CONFIG.sizes.indexOf(cartState.size) !== -1;
    }
    return false;
  }

  function seriesButtonsHtml(selectedId, slotKey) {
    return SERIES_ORDER.map(function (id) {
      var s = CONFIG.series[id];
      var sel = selectedId === id ? ' is-selected' : '';
      return '<button type="button" class="cart-option' + sel + '" data-pick-series="' + id + '"' +
        (slotKey != null ? ' data-slot="' + slotKey + '"' : '') +
        ' style="--co-accent:' + s.accent + '">' +
        '<span class="co-swatch" aria-hidden="true"></span>' +
        '<span class="co-label">' + s.title + '</span>' +
        '</button>';
    }).join('');
  }

  function renderCart() {
    if (!cartBody) return;
    var type = cartState.type;
    var titleMap = {
      single: 'Sculpture',
      duo: 'Duo Ezéa',
      full: 'Full Collection',
      kit: 'Kit Starfobar',
    };
    var kickMap = {
      single: 'Pièce unique · 190 €',
      duo: 'Combo · 340 €',
      full: 'Collector · 680 €',
      kit: 'Sculpture + merch · 229 €',
    };
    document.getElementById('cartTitle').textContent = titleMap[type] || 'Panier';
    document.getElementById('cartKicker').textContent = kickMap[type] || 'Panier';

    var html = '';

    if (type === 'single') {
      html += '<div class="cart-section"><div class="cart-section-label">Série</div>' +
        '<p class="cart-hint">Une sculpture 25 cm, numérotée.</p>' +
        '<div class="cart-options">' + seriesButtonsHtml(cartState.series[0], null) + '</div></div>';
    }

    if (type === 'duo') {
      html += '<div class="cart-section"><div class="cart-section-label">Composition</div>' +
        '<p class="cart-hint">Choisis 2 sculptures (même série possible).</p><div class="cart-duo-slots">';
      html += '<div><div class="cart-slot-label">Pièce 1</div><div class="cart-options">' +
        seriesButtonsHtml(cartState.series[0], 0) + '</div></div>';
      html += '<div><div class="cart-slot-label">Pièce 2</div><div class="cart-options">' +
        seriesButtonsHtml(cartState.series[1], 1) + '</div></div>';
      html += '</div></div>';
    }

    if (type === 'full') {
      html += '<div class="cart-section"><div class="cart-section-label">Inclus</div>' +
        '<p class="cart-hint">Les 4 séries + coffret collector + certificats.</p>' +
        '<div class="cart-options">' +
        SERIES_ORDER.map(function (id) {
          var s = CONFIG.series[id];
          return '<div class="cart-option is-selected" style="--co-accent:' + s.accent + ';cursor:default">' +
            '<span class="co-swatch"></span><span class="co-label">' + s.title + '</span></div>';
        }).join('') +
        '</div></div>';
    }

    if (type === 'kit') {
      html += '<div class="cart-section"><div class="cart-section-label">Sculpture</div>' +
        '<div class="cart-options">' + seriesButtonsHtml(cartState.series[0], null) + '</div></div>';
      html += '<div class="cart-section"><div class="cart-section-label">Textile Starfobar</div>' +
        '<div class="cart-chip-row">' +
        Object.keys(CONFIG.merch).map(function (m) {
          return '<button type="button" class="cart-chip' + (cartState.merch === m ? ' is-selected' : '') +
            '" data-pick-merch="' + m + '">' + CONFIG.merch[m].replace(' Starfobar', '') + '</button>';
        }).join('') +
        '</div></div>';
      html += '<div class="cart-section"><div class="cart-section-label">Taille</div>' +
        '<div class="cart-chip-row">' +
        CONFIG.sizes.map(function (sz) {
          return '<button type="button" class="cart-chip' + (cartState.size === sz ? ' is-selected' : '') +
            '" data-pick-size="' + sz + '">' + sz + '</button>';
        }).join('') +
        '</div></div>';
    }

    html += '<div class="cart-section"><div class="cart-section-label">Livraison</div>' +
      '<p class="cart-hint">Les frais s\'ajoutent au total. L\'adresse exacte sera saisie sur Stripe.</p>' +
      '<div class="cart-ship-list">';
    Object.keys(CONFIG.shipping).forEach(function (key) {
      var sh = CONFIG.shipping[key];
      html += '<button type="button" class="cart-ship' + (cartState.shipping === key ? ' is-selected' : '') +
        '" data-pick-ship="' + key + '">' +
        '<span class="cs-name">' + sh.label + '</span>' +
        '<span class="cs-price">' + euro(sh.amount) + '</span>' +
        '<span class="cs-desc">' + sh.desc + '</span></button>';
    });
    html += '</div></div>';

    var productLabel = '—';
    if (type === 'single' && cartState.series[0]) productLabel = CONFIG.series[cartState.series[0]].title;
    if (type === 'duo' && cartState.series.length === 2) {
      productLabel = cartState.series.map(function (s) { return CONFIG.series[s].title; }).join(' + ');
    }
    if (type === 'full') productLabel = '4 séries + coffret';
    if (type === 'kit' && cartState.series[0] && cartState.merch && cartState.size) {
      productLabel = CONFIG.series[cartState.series[0]].title + ' + ' +
        CONFIG.merch[cartState.merch] + ' · ' + cartState.size;
    }

    html += '<div class="cart-section"><div class="cart-section-label">Récapitulatif</div><div class="cart-recap">' +
      '<div class="cart-recap-row"><span>Produit</span><span>' + productLabel + '</span></div>' +
      '<div class="cart-recap-row"><span>Sous-total</span><span>' + euro(cartSubtotal()) + '</span></div>' +
      '<div class="cart-recap-row"><span>Livraison</span><span>' + euro(cartShippingAmount()) + '</span></div>' +
      '<div class="cart-recap-row total"><span>Total</span><span>' + euro(cartTotal()) + '</span></div>' +
      '</div></div>';

    cartBody.innerHTML = html;
    if (cartPayBtn) {
      cartPayBtn.disabled = !cartIsValid() || cartBusy;
      cartPayBtn.textContent = cartBusy ? 'Redirection…' : 'Payer ' + euro(cartTotal());
    }
  }

  function openCart(opts) {
    opts = opts || {};
    cartState = {
      type: opts.type || 'single',
      series: (opts.series || []).slice(),
      merch: null,
      size: null,
      shipping: 'fr',
    };
    if (cartState.type === 'full') cartState.series = SERIES_ORDER.slice();
    if (cartState.type === 'duo' && cartState.series.length === 0) cartState.series = [null, null];
    if (cartState.type === 'duo' && cartState.series.length === 1) cartState.series.push(null);
    if (cartOverlay) {
      cartOverlay.hidden = false;
      cartOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    // Fermer la modale sculpture si ouverte
    if (modal && modal.classList.contains('open')) closeModal();
    renderCart();
    track('cart_open', { type: cartState.type });
    var closeBtn = document.getElementById('cartClose');
    if (closeBtn) closeBtn.focus();
  }

  function closeCart() {
    if (!cartOverlay) return;
    cartOverlay.classList.remove('open');
    cartOverlay.hidden = true;
    if (!modal || !modal.classList.contains('open')) document.body.style.overflow = '';
  }

  function onCartClick(e) {
    var t = e.target.closest('[data-pick-series], [data-pick-merch], [data-pick-size], [data-pick-ship]');
    if (!t) return;
    if (t.hasAttribute('data-pick-series')) {
      var sid = t.getAttribute('data-pick-series');
      var slot = t.getAttribute('data-slot');
      if (cartState.type === 'duo' && slot != null) {
        cartState.series[parseInt(slot, 10)] = sid;
      } else {
        cartState.series = [sid];
      }
    }
    if (t.hasAttribute('data-pick-merch')) cartState.merch = t.getAttribute('data-pick-merch');
    if (t.hasAttribute('data-pick-size')) cartState.size = t.getAttribute('data-pick-size');
    if (t.hasAttribute('data-pick-ship')) cartState.shipping = t.getAttribute('data-pick-ship');
    renderCart();
  }

  function submitCart() {
    if (!cartIsValid() || cartBusy) return;
    cartBusy = true;
    renderCart();
    var payload = {
      type: cartState.type,
      series: cartState.type === 'full' ? SERIES_ORDER.slice() : cartState.series.filter(Boolean),
      merch: cartState.merch,
      size: cartState.size,
      shipping: cartState.shipping,
    };
    track('checkout_start', { type: payload.type, shipping: payload.shipping });
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(function (res) {
      return res.json().then(function (data) { return { ok: res.ok, status: res.status, data: data }; });
    }).then(function (r) {
      if (r.ok && r.data && r.data.url) {
        window.location.href = r.data.url;
        return;
      }
      cartBusy = false;
      renderCart();
      if (r.status === 503 || (r.data && r.data.error === 'not_configured')) {
        toast('Paiement en cours d\'activation — laisse ton email, on te prévient.');
        closeCart();
        var nl = document.getElementById('newsletter');
        if (nl) nl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      toast((r.data && r.data.error) || 'Impossible de lancer le paiement.');
    }).catch(function () {
      cartBusy = false;
      renderCart();
      toast('Erreur réseau — réessaie dans un instant.');
    });
  }

  function initCart() {
    if (!cartOverlay) return;
    document.getElementById('cartClose').addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', function (e) {
      if (e.target === cartOverlay) closeCart();
    });
    cartBody.addEventListener('click', onCartClick);
    cartPayBtn.addEventListener('click', submitCart);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && cartOverlay.classList.contains('open')) closeCart();
    });

    // Retour Stripe
    try {
      var params = new URLSearchParams(window.location.search);
      var checkout = params.get('checkout');
      if (checkout === 'success') {
        toast('Merci — paiement reçu. Tu vas recevoir la confirmation par email.');
        track('checkout_success', {});
      } else if (checkout === 'cancel') {
        toast('Paiement annulé — ton panier t\'attend quand tu veux.');
        track('checkout_cancel', {});
      }
      if (checkout) {
        params.delete('checkout');
        var qs = params.toString();
        window.history.replaceState({}, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
      }
    } catch (err) { /* no-op */ }
  }

  /* ──────────── MODALE SCULPTURE ──────────── */
  var modal = document.getElementById('sculptureModal');
  var modalState = { images: [], index: 0, series: null };
  var modalAutoTimer = null;
  var MODAL_AUTO_MS = 4000;

  function stopModalAutoplay() {
    if (modalAutoTimer) {
      clearInterval(modalAutoTimer);
      modalAutoTimer = null;
    }
  }

  function startModalAutoplay() {
    stopModalAutoplay();
    if (modalState.images.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    modalAutoTimer = setInterval(function () {
      modalNav(1, true);
    }, MODAL_AUTO_MS);
  }

  function resetModalAutoplay() {
    if (!modal.classList.contains('open')) return;
    startModalAutoplay();
  }

  function renderModal(opts) {
    opts = opts || {};
    var img = document.getElementById('modalImg');
    var dots = document.getElementById('modalDots');
    var thumbs = document.getElementById('modalThumbs');
    var counter = document.getElementById('modalCounter');
    var total = modalState.images.length;
    var idx = modalState.index;
    var src = modalState.images[idx] || '';
    var title = CONFIG.series[modalState.series] ? CONFIG.series[modalState.series].title : '';

    function applySrc() {
      img.src = src;
      img.alt = 'Sculpture ' + title + ' — photo ' + (idx + 1) + ' sur ' + total;
      img.classList.toggle('is-landscape', false);
      var probe = new Image();
      probe.onload = function () {
        img.classList.toggle('is-landscape', probe.naturalWidth > probe.naturalHeight);
      };
      probe.src = src;
    }

    if (opts.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      img.classList.add('is-swiping');
      setTimeout(function () {
        applySrc();
        requestAnimationFrame(function () {
          img.classList.remove('is-swiping');
        });
      }, 180);
    } else {
      applySrc();
    }

    if (counter) {
      counter.textContent = (idx + 1) + ' / ' + total;
      counter.hidden = total < 2;
    }

    if (dots) {
      dots.innerHTML = '';
      modalState.images.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'modal-dot' + (i === idx ? ' active' : '');
        d.type = 'button';
        d.setAttribute('aria-label', 'Photo ' + (i + 1));
        d.addEventListener('click', function () {
          modalState.index = i;
          renderModal({ animate: true });
          resetModalAutoplay();
        });
        dots.appendChild(d);
      });
      dots.hidden = total < 2;
    }

    if (thumbs) {
      thumbs.innerHTML = '';
      thumbs.hidden = total < 2;
      modalState.images.forEach(function (url, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'modal-thumb' + (i === idx ? ' active' : '');
        b.setAttribute('aria-label', 'Aperçu photo ' + (i + 1));
        b.setAttribute('aria-current', i === idx ? 'true' : 'false');
        var t = document.createElement('img');
        t.src = url;
        t.alt = '';
        t.loading = 'lazy';
        b.appendChild(t);
        b.addEventListener('click', function () {
          modalState.index = i;
          renderModal({ animate: true });
          resetModalAutoplay();
        });
        thumbs.appendChild(b);
      });
      var activeThumb = thumbs.querySelector('.modal-thumb.active');
      if (activeThumb && typeof activeThumb.scrollIntoView === 'function') {
        activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }

  function openModal(seriesId) {
    var s = CONFIG.series[seriesId];
    if (!s) return;
    modalState = { images: s.images.slice(), index: 0, series: seriesId };
    document.getElementById('modalTag').textContent = s.tag;
    document.getElementById('modalTitle').textContent = s.title;
    document.getElementById('modalDesc').textContent = s.desc;
    document.querySelector('.modal').style.setProperty('--modal-accent', s.accent);
    var specsEl = document.getElementById('modalSpecs');
    specsEl.innerHTML = s.specs.map(function (sp) {
      return '<div class="card-spec"><div class="lbl">' + sp[0] + '</div><div class="val">' + sp[1] + '</div></div>';
    }).join('');
    var cta = document.getElementById('modalCta');
    cta.dataset.series = seriesId;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderModal();
    startModalAutoplay();
    document.getElementById('modalClose').focus();
    track('modal_open', { series: seriesId });
  }

  function closeModal() {
    stopModalAutoplay();
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function modalNav(dir, fromAuto) {
    if (!modalState.images.length) return;
    modalState.index = (modalState.index + dir + modalState.images.length) % modalState.images.length;
    renderModal({ animate: true });
    if (!fromAuto) resetModalAutoplay();
  }

  /* ──────────── NEWSLETTER ──────────── */
  function submitNewsletter(e) {
    e.preventDefault();
    var input = document.getElementById('newsletter-email');
    var btn = document.getElementById('newsletterBtn');
    var msg = document.getElementById('newsletterMsg');
    var email = (input.value || '').trim();
    msg.className = 'newsletter-msg';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = 'Email invalide.';
      msg.classList.add('err');
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Envoi…';
    fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, source: 'starfobar' }),
    }).then(function (res) {
      return res.json().then(function (data) { return { ok: res.ok, data: data }; });
    }).then(function (r) {
      if (!r.ok) throw new Error(r.data && r.data.error ? r.data.error : 'Erreur');
      msg.textContent = 'C\'est noté — tu seras prévenu·e.';
      msg.classList.add('ok');
      input.value = '';
      track('newsletter_signup', { source: 'starfobar' });
    }).catch(function (err) {
      msg.textContent = err.message === 'not_configured'
        ? 'Newsletter bientôt active — reviens vite.'
        : 'Oups, réessaie dans un instant.';
      msg.classList.add('err');
    }).finally(function () {
      btn.disabled = false;
      btn.textContent = 'Prévenez-moi';
    });
  }

  /* ──────────── PRODUIT SLIDER (swipe + autoplay sur les cartes) ──────────── */
  var CARD_AUTO_MS = 4000;

  function initProductSliders() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cards = document.querySelectorAll('.card-visual[data-details]');
    if (!cards.length) return;

    cards.forEach(function (card) {
      var seriesId = card.dataset.details;
      var series = CONFIG.series[seriesId];
      if (!series || !series.images || series.images.length < 2) return;

      var stage = card.querySelector('.card-visual-stage');
      if (!stage) return;

      var images = series.images.slice();
      var index = 0;
      var timer = null;
      var inView = false;
      var startX = 0;
      var startY = 0;
      var dragging = false;
      var axis = null;
      var moved = false;

      // Rebuild stage with all images (crossfade)
      stage.innerHTML = '';
      images.forEach(function (src, i) {
        var img = document.createElement('img');
        img.src = src;
        img.alt = series.title + ' — photo ' + (i + 1);
        img.loading = i === 0 ? 'eager' : 'lazy';
        if (i === 0) img.classList.add('is-active');
        stage.appendChild(img);
      });

      var dots = document.createElement('div');
      dots.className = 'card-visual-dots';
      dots.setAttribute('role', 'tablist');
      dots.setAttribute('aria-label', 'Photos ' + series.title);
      images.forEach(function (_, i) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'card-visual-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Photo ' + (i + 1));
        d.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          goTo(i, true);
        });
        dots.appendChild(d);
      });
      card.appendChild(dots);

      function render() {
        var imgs = stage.querySelectorAll('img');
        imgs.forEach(function (img, i) {
          img.classList.toggle('is-active', i === index);
        });
        dots.querySelectorAll('.card-visual-dot').forEach(function (d, i) {
          d.classList.toggle('active', i === index);
        });
      }

      function goTo(i, user) {
        index = (i + images.length) % images.length;
        render();
        if (user) resetAuto();
      }

      function next() { goTo(index + 1, false); }

      function stopAuto() {
        if (timer) { clearInterval(timer); timer = null; }
      }

      function startAuto() {
        stopAuto();
        if (reduce || !inView || document.hidden || images.length < 2) return;
        timer = setInterval(next, CARD_AUTO_MS);
      }

      function resetAuto() {
        if (inView) startAuto();
      }

      // Autoplay seulement quand la carte est visible
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            inView = entry.isIntersecting;
            if (inView) startAuto();
            else stopAuto();
          });
        }, { threshold: 0.35 });
        io.observe(card);
      } else {
        inView = true;
        startAuto();
      }

      function onStart(x, y) {
        dragging = true;
        moved = false;
        axis = null;
        startX = x;
        startY = y;
        stopAuto();
      }

      function onMove(x, y) {
        if (!dragging) return;
        var dx = x - startX;
        var dy = y - startY;
        if (!axis) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
          axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
          if (axis === 'y') dragging = false;
        }
        if (axis === 'x' && Math.abs(dx) > 12) moved = true;
      }

      function onEnd(x) {
        if (!dragging && axis !== 'x') {
          dragging = false;
          axis = null;
          resetAuto();
          return !moved;
        }
        var dx = x - startX;
        dragging = false;
        if (axis === 'x' && Math.abs(dx) > 40) {
          goTo(index + (dx < 0 ? 1 : -1), true);
          moved = true;
        } else {
          resetAuto();
        }
        axis = null;
        return !moved;
      }

      card.addEventListener('touchstart', function (e) {
        if (e.target.closest('.card-visual-dot')) return;
        if (!e.touches[0]) return;
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });

      card.addEventListener('touchmove', function (e) {
        if (!e.touches[0]) return;
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });

      card.addEventListener('touchend', function (e) {
        if (!e.changedTouches[0]) return;
        onEnd(e.changedTouches[0].clientX);
      }, { passive: true });

      card.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'touch') return;
        if (e.button !== 0) return;
        if (e.target.closest('.card-visual-dot')) return;
        onStart(e.clientX, e.clientY);
      });

      card.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        onMove(e.clientX, e.clientY);
      });

      card.addEventListener('pointerup', function (e) {
        if (e.pointerType === 'touch') return;
        onEnd(e.clientX);
      });

      // Clic / clavier → ouvrir la modale (sauf après un swipe)
      card.addEventListener('click', function (e) {
        if (e.target.closest('.card-visual-dot')) return;
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
          return;
        }
        e.preventDefault();
        openModal(seriesId);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(seriesId);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goTo(index + 1, true);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goTo(index - 1, true);
        }
      });
    });

    document.addEventListener('visibilitychange', function () {
      // restart handled per-card via their own timers on next intersection / focus
      if (document.hidden) {
        cards.forEach(function () { /* timers cleared via stop when hidden checked in startAuto */ });
      }
    });
  }

  /* ──────────── HERO VIDÉO (chargement conditionnel) ──────────── */
  function initHeroVideo() {
    var video = document.querySelector('.hero-video');
    var toggle = document.getElementById('mediaToggle');
    if (!video) return;

    // Mobile : on économise la data → pas de vidéo, Ken Burns sur le poster.
    var isMobile = window.matchMedia('(max-width: 768px)').matches;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || reduce) return;

    var mp4 = video.dataset.srcMp4;
    // Vérifie l'existence du fichier avant de charger (évite un élément vidéo vide).
    fetch(mp4, { method: 'HEAD' }).then(function (res) {
      if (!res.ok) return;
      var webm = video.dataset.srcWebm;
      if (webm) { var sW = document.createElement('source'); sW.src = webm; sW.type = 'video/webm'; video.appendChild(sW); }
      var sM = document.createElement('source'); sM.src = mp4; sM.type = 'video/mp4'; video.appendChild(sM);
      video.preload = 'metadata';
      video.load();
      video.play().then(function () {
        video.classList.add('is-playing');
        toggle.style.display = 'flex';
      }).catch(function () { /* autoplay bloqué → poster/Ken Burns */ });
    }).catch(function () { /* pas de vidéo → fallback silencieux */ });

    var playing = true;
    toggle.addEventListener('click', function () {
      playing = !playing;
      if (playing) { video.play(); toggle.textContent = '❚❚'; toggle.setAttribute('aria-label', 'Mettre en pause la vidéo'); }
      else { video.pause(); toggle.textContent = '►'; toggle.setAttribute('aria-label', 'Lire la vidéo'); }
    });
  }

  /* ──────────── SOUND TOGGLE (JuL — La faille) ──────────── */
  function initSoundToggle() {
    var soundBtn = document.getElementById('soundToggle');
    if (!soundBtn) return;

    var STORAGE_KEY = 'starfobar-sound';
    var audio = null;
    var on = false;
    var userMuted = false;
    try { userMuted = sessionStorage.getItem(STORAGE_KEY) === 'off'; } catch (e) { /* no-op */ }

    function ensureAudio() {
      if (audio) return audio;
      audio = new Audio('/assets/audio/ambiance.mp3');
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0.7;
      audio.addEventListener('ended', function () {
        if (on) { audio.currentTime = 0; audio.play().catch(function () {}); }
      });
      return audio;
    }

    function setUi(isOn) {
      on = isOn;
      soundBtn.querySelector('.icon').textContent = isOn ? '🔊' : '🔇';
      soundBtn.querySelector('.lbl').textContent = isOn ? 'SON ON' : 'SON OFF';
      soundBtn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
      soundBtn.setAttribute('aria-label', isOn ? 'Couper le son' : 'Activer l\'ambiance sonore');
      soundBtn.title = isOn ? 'Couper le son' : 'Activer l\'ambiance sonore';
    }

    function persist(isOn) {
      try { sessionStorage.setItem(STORAGE_KEY, isOn ? 'on' : 'off'); } catch (e) { /* no-op */ }
    }

    function playSound(fromUser) {
      if (userMuted && !fromUser) return Promise.resolve(false);
      var a = ensureAudio();
      return a.play().then(function () {
        setUi(true);
        userMuted = false;
        persist(true);
        if (fromUser) track('sound_on', { track: 'la-faille' });
        return true;
      }).catch(function () {
        setUi(false);
        return false;
      });
    }

    function stopSound(fromUser) {
      if (audio) audio.pause();
      setUi(false);
      userMuted = true;
      persist(false);
      if (fromUser) track('sound_off', {});
    }

    function unlockOnGesture(e) {
      if (on || userMuted) {
        removeUnlockListeners();
        return;
      }
      // Le bouton son a son propre handler — ne pas doubler ici
      if (e && soundBtn.contains(e.target)) return;
      playSound(false).then(function (ok) {
        if (ok) {
          removeUnlockListeners();
          track('sound_autoplay_unlocked', { track: 'la-faille' });
        }
      });
    }

    var unlockEvents = ['pointerdown', 'keydown', 'scroll', 'wheel'];
    function addUnlockListeners() {
      unlockEvents.forEach(function (ev) {
        document.addEventListener(ev, unlockOnGesture, { passive: true });
      });
    }
    function removeUnlockListeners() {
      unlockEvents.forEach(function (ev) {
        document.removeEventListener(ev, unlockOnGesture);
      });
    }

    setUi(false);

    // Lancement auto au chargement (si le navigateur le permet)
    if (!userMuted) {
      ensureAudio();
      playSound(false).then(function (ok) {
        if (ok) track('sound_autoplay', { track: 'la-faille' });
        else addUnlockListeners(); // sinon dès le 1er geste
      });
    }

    soundBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!on) {
        userMuted = false;
        playSound(true).then(function (ok) {
          if (ok) removeUnlockListeners();
          else toast('Impossible de lancer le son — réessaie.');
        });
      } else {
        stopSound(true);
      }
    });

    // Pause auto si l'onglet est masqué (économie batterie / politesse)
    document.addEventListener('visibilitychange', function () {
      if (!audio || userMuted) return;
      if (document.hidden) {
        audio.pause();
      } else if (on) {
        audio.play().catch(function () {});
      }
    });
  }

  /* ──────────── FADE-IN + NAV + COMPTEUR ──────────── */
  function initScrollFx() {
    var nav = document.getElementById('topnav');
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 100);
    }, { passive: true });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.sculpture-card, .car-narrative, .bundle, .wall-item, .included-item, .fade-in')
        .forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    var groups = [
      { sel: '.sculpture-card', step: 120 },
      { sel: '.car-narrative', step: 0 },
      { sel: '.bundle', step: 100 },
      { sel: '.wall-item', step: 80 },
      { sel: '.included-item', step: 70 },
      { sel: '.fade-in:not(.sculpture-card):not(.car-narrative):not(.bundle):not(.wall-item):not(.included-item)', step: 90 },
    ];

    groups.forEach(function (g) {
      document.querySelectorAll(g.sel).forEach(function (el, i) {
        el.classList.add('fade-in');
        if (g.step) el.style.setProperty('--reveal-delay', (i * g.step) + 'ms');
        observer.observe(el);
      });
    });
  }

  /* ──────────── INIT ──────────── */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.cta-primary[data-series], .cta-primary[data-bundle]')
      .forEach(function (btn) { btn.addEventListener('click', handleBuy); });

    document.querySelectorAll('[data-details]:not(.card-visual)').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); openModal(btn.dataset.details); });
    });

    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalPrev').addEventListener('click', function () { modalNav(-1); });
    document.getElementById('modalNext').addEventListener('click', function () { modalNav(1); });
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowLeft') modalNav(-1);
      else if (e.key === 'ArrowRight') modalNav(1);
    });

    // Swipe mobile sur la galerie modale
    var gallery = document.querySelector('.modal-gallery');
    var startX = 0;
    if (gallery) {
      gallery.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
      gallery.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) modalNav(dx < 0 ? 1 : -1);
      }, { passive: true });
    }

    var nlForm = document.getElementById('newsletterForm');
    if (nlForm) nlForm.addEventListener('submit', submitNewsletter);

    initHeroVideo();
    initProductSliders();
    initCart();

    // Bande ambiance : respecte prefers-reduced-motion (poster seul).
    var ambiance = document.querySelector('.ambiance-video');
    if (ambiance && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ambiance.removeAttribute('autoplay');
      ambiance.pause();
    }

    initSoundToggle();
    initScrollFx();
  });
})();
