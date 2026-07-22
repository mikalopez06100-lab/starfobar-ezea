/* ══════════════════════════════════════════════════════════
   Landing Starfobar × Ezéa — logique front
   - CTAs → Stripe Payment Links (config ci-dessous)
   - Modale galerie sculpture (clavier + swipe)
   - Capture newsletter (Brevo via /api/newsletter)
   - Hero swipe d'images + vidéo optionnelle
   Aucune dépendance externe. Vanilla JS.
   ══════════════════════════════════════════════════════════ */
(function starfobar() {
  'use strict';

  /* ────────────────────────────────────────────────
     CONFIG — À COMPLÉTER PAR MICHAËL
     Colle ici les URL des Stripe Payment Links (1 par série + 1 par bundle).
     Tant qu'une valeur est `null`, le CTA affiche « bientôt disponible »
     et invite à laisser son email (aucun paiement lancé).
     Voir README §Starfobar pour créer les Payment Links.
     ──────────────────────────────────────────────── */
  var CONFIG = {
    price: 190,
    paymentLinks: {
      // Séries (190 € chacune)
      sleeper: null,      // ex : 'https://buy.stripe.com/xxxxx'
      racing: null,
      propaganda: null,
      marlboro: null,
      // Bundles
      duo: null,          // 340 €
      full: null,         // 680 €
      kit: null,          // 229 €
    },
    // Détails affichés dans la modale « Voir les détails ».
    // images : placeholders garage tant que les photos HD sculptures ne sont pas fournies.
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

  /* ──────────── CTAs → Payment Links ──────────── */
  function handleBuy(e) {
    var btn = e.currentTarget;
    e.preventDefault();
    var id = btn.dataset.series || btn.dataset.bundle;
    if (!id) return;
    var link = CONFIG.paymentLinks[id];
    track('cta_click', { item: id, hasLink: !!link });
    if (link) {
      window.location.href = link;
    } else {
      toast('Paiement en cours d\'activation — laisse ton email, on te prévient dès l\'ouverture.');
      var nl = document.getElementById('newsletter');
      if (nl) nl.scrollIntoView({ behavior: 'smooth' });
      var input = document.getElementById('newsletter-email');
      if (input) setTimeout(function () { input.focus(); }, 600);
    }
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

  /* ──────────── HERO SLIDER (swipe + autoplay) ──────────── */
  var HERO_AUTO_MS = 4000;
  var heroSliderApi = null;

  function initHeroSlider() {
    var hero = document.querySelector('.hero');
    var track = document.getElementById('heroTrack');
    var dotsEl = document.getElementById('heroDots');
    var media = document.getElementById('heroMedia');
    var btnPrev = document.getElementById('heroPrev');
    var btnNext = document.getElementById('heroNext');
    if (!hero || !track || !dotsEl || !media) return null;

    var slides = Array.prototype.slice.call(track.querySelectorAll('.hero-slide'));
    if (slides.length < 2) return null;

    var index = 0;
    var timer = null;
    var startX = 0;
    var startY = 0;
    var dragging = false;
    var axis = null;
    var locked = false;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var surface = hero;

    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hero-dot' + (i === 0 ? ' active' : '');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Photo ' + (i + 1));
      b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        goTo(i, true);
      });
      dotsEl.appendChild(b);
    });

    function render() {
      slides.forEach(function (s, i) {
        s.classList.toggle('is-active', i === index);
        s.classList.remove('is-prev');
        s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
      var dots = dotsEl.querySelectorAll('.hero-dot');
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === index);
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }

    function goTo(i, user) {
      var next = (i + slides.length) % slides.length;
      if (next === index) return;
      index = next;
      render();
      if (user) resetAuto();
    }

    function next() { goTo(index + 1, false); }
    function prev() { goTo(index - 1, false); }

    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function startAuto() {
      stopAuto();
      if (locked || reduce || slides.length < 2) return;
      if (document.hidden) return;
      timer = setInterval(next, HERO_AUTO_MS);
    }

    function resetAuto() {
      if (!locked) startAuto();
    }

    function setLocked(isLocked) {
      locked = !!isLocked;
      hero.classList.toggle('is-video-playing', locked);
      if (locked) stopAuto();
      else startAuto();
    }

    if (btnPrev) btnPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(index - 1, true);
    });
    if (btnNext) btnNext.addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(index + 1, true);
    });

    function onStart(clientX, clientY) {
      if (locked) return false;
      dragging = true;
      axis = null;
      startX = clientX;
      startY = clientY;
      stopAuto();
      return true;
    }

    function onMove(clientX, clientY) {
      if (!dragging) return;
      var dx = clientX - startX;
      var dy = clientY - startY;
      if (!axis) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (axis === 'y') {
          dragging = false;
          resetAuto();
        }
      }
    }

    function onEnd(clientX) {
      if (!dragging) return;
      dragging = false;
      var dx = clientX - startX;
      var threshold = 50;
      if (axis === 'x' && dx < -threshold) goTo(index + 1, true);
      else if (axis === 'x' && dx > threshold) goTo(index - 1, true);
      else resetAuto();
      axis = null;
    }

    // Touch (fiable sur mobile)
    surface.addEventListener('touchstart', function (e) {
      if (e.target.closest('button, a, input, textarea, select, label')) return;
      if (!e.touches[0]) return;
      onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    surface.addEventListener('touchmove', function (e) {
      if (!dragging || !e.touches[0]) return;
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    surface.addEventListener('touchend', function (e) {
      if (!e.changedTouches[0]) return;
      onEnd(e.changedTouches[0].clientX);
    }, { passive: true });

    // Pointer / souris (desktop)
    surface.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return; // géré via touch*
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest('button, a, input, textarea, select, label')) return;
      if (!onStart(e.clientX, e.clientY)) return;
      try { surface.setPointerCapture(e.pointerId); } catch (err) { /* no-op */ }
    });

    surface.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      onMove(e.clientX, e.clientY);
    });

    surface.addEventListener('pointerup', function (e) {
      if (e.pointerType === 'touch') return;
      onEnd(e.clientX);
    });

    surface.addEventListener('pointercancel', function (e) {
      if (e.pointerType === 'touch') return;
      dragging = false;
      axis = null;
      resetAuto();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAuto();
      else resetAuto();
    });

    render();
    startAuto();

    return { goTo: goTo, setLocked: setLocked, next: next, prev: prev };
  }

  /* ──────────── HERO VIDÉO (chargement conditionnel) ──────────── */
  function initHeroVideo() {
    var video = document.querySelector('.hero-video');
    var toggle = document.getElementById('mediaToggle');
    if (!video) return;

    // Mobile : on économise la data → pas de vidéo, swipe d'images.
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
        if (heroSliderApi) heroSliderApi.setLocked(true);
      }).catch(function () { /* autoplay bloqué → swipe images */ });
    }).catch(function () { /* pas de vidéo → fallback silencieux */ });

    var playing = true;
    toggle.addEventListener('click', function () {
      playing = !playing;
      if (playing) {
        video.play();
        toggle.textContent = '❚❚';
        toggle.setAttribute('aria-label', 'Mettre en pause la vidéo');
        video.classList.add('is-playing');
        if (heroSliderApi) heroSliderApi.setLocked(true);
      } else {
        video.pause();
        toggle.textContent = '►';
        toggle.setAttribute('aria-label', 'Lire la vidéo');
        video.classList.remove('is-playing');
        if (heroSliderApi) heroSliderApi.setLocked(false);
      }
    });
  }

  /* ──────────── SOUND TOGGLE (JuL — La faille) ──────────── */
  function initSoundToggle() {
    var soundBtn = document.getElementById('soundToggle');
    if (!soundBtn) return;

    var audio = null;
    var on = false;

    function ensureAudio() {
      if (audio) return audio;
      audio = new Audio('/assets/audio/ambiance.mp3');
      audio.loop = true;
      audio.preload = 'none';
      audio.volume = 0.7;
      audio.addEventListener('ended', function () {
        // Sécurité si loop non supporté
        if (on) { audio.currentTime = 0; audio.play().catch(function () {}); }
      });
      return audio;
    }

    function setUi(isOn) {
      on = isOn;
      soundBtn.querySelector('.icon').textContent = isOn ? '🔊' : '🔇';
      soundBtn.querySelector('.lbl').textContent = isOn ? 'SON ON' : 'SON OFF';
      soundBtn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
      soundBtn.title = isOn ? 'Couper le son' : 'Activer l\'ambiance sonore';
    }

    setUi(false);

    soundBtn.addEventListener('click', function () {
      var a = ensureAudio();
      if (!on) {
        a.play().then(function () {
          setUi(true);
          track('sound_on', { track: 'la-faille' });
        }).catch(function () {
          setUi(false);
          toast('Impossible de lancer le son — réessaie.');
        });
      } else {
        a.pause();
        setUi(false);
        track('sound_off', {});
      }
    });

    // Pause auto si l'onglet est masqué (économie batterie / politesse)
    document.addEventListener('visibilitychange', function () {
      if (!audio || !on) return;
      if (document.hidden) audio.pause();
      else audio.play().catch(function () {});
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

    document.querySelectorAll('[data-details]').forEach(function (btn) {
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

    heroSliderApi = initHeroSlider();
    initHeroVideo();

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
