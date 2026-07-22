# Starfobar × Ezéa — Landing

Site de vente de la collection **Starfobar × Ezéa** : 4 séries de sculptures résine
(bombes aérosol), édition limitée, née à l'événement Starfobar Édition 04.
Concept « visite du garage de Chris ».

> **Born to Burn Out.** · Drift · Street · Race · Classic

Projet **statique + une fonction serverless** (newsletter Brevo). Aucune dépendance
de build : la page est autonome (HTML + CSS inline + JS vanilla).

## Structure

```
index.html            → la landing complète (HTML + CSS inline)
js/
  starfobar.js        → CTAs Stripe, modale galerie, newsletter, hero vidéo (+ CONFIG)
  analytics.js        → Vercel Web Analytics (injecté côté client)
api/
  newsletter.js       → POST /api/newsletter → email Resend (+ Brevo optionnel)
  checkout.js         → POST /api/checkout → Stripe Checkout Session
  stripe-webhook.js   → POST /api/stripe-webhook → email commande Resend
lib/
  resend.js           → client + templates emails
assets/
  sculptures/         → photos produit ({serie}.jpg) + packaging ({serie}-case.jpg)
  cars/               → voitures d'inspiration ({serie}.jpg) — fonds de section
  garage/             → photos d'ambiance du garage (hero, wall)
  video/              → bande ambiance (ambiance-starfobar.mp4 / .webm + poster)
vercel.json           → cache long des /assets
.env.example          → variables Brevo
```

Les 4 séries (clés internes) : `propaganda`, `racing`, `sleeper` (« Old School BMW »), `marlboro`.

## Lancer en local

La page est autonome : ouvrir `index.html` dans un navigateur **suffit** pour le visuel.

Pour un vrai serveur local (chemins absolus + test des routes) :

```bash
npx serve .          # sert sur http://localhost:3000
# ou, pour tester /api/newsletter :
npx vercel dev
```

## Déploiement (Vercel)

Projet 100 % compatible Vercel (static + `/api`). Depuis ce dossier :

```bash
npx vercel            # preview
npx vercel --prod     # production
```

### Domaine production

Site live : **https://starfobarxezea.com** (apex + `www` sur Vercel, DNS IONOS).

## Brancher les paiements (Stripe Checkout)

Le site ouvre un **panier** (série / duo / kit / full + zone de livraison), puis
crée une **Checkout Session** via `POST /api/checkout`.

1. Dashboard Stripe → Developers → API keys → copier la **Secret key**
2. Dans Vercel (Project → Settings → Environment Variables) :
   - `STRIPE_SECRET_KEY=sk_test_…` (ou `sk_live_…`)
   - optionnel : `SITE_URL=https://starfobarxezea.com`
3. Redeploy. Sans cette clé, le bouton « Payer » renvoie vers la newsletter
   (« paiement en cours d'activation ») — **aucun paiement lancé**.

### Catalogue (validé côté serveur)

| Offre | Prix | Options panier |
|---|---|---|
| Sculpture seule | 190 € | 1 série |
| Duo Ezéa | 340 € | 2 séries au choix |
| Full Collection | 680 € | 4 séries fixées |
| Kit Starfobar | 229 € | 1 série + textile + taille |

### Frais de port (ajoutés au panier)

| Zone | Tarif |
|---|---|
| France métropolitaine | 9,90 € |
| Union européenne | 19,90 € |
| International | 29,90 € |

L'adresse de livraison exacte est collectée sur la page Stripe.
Les choix (séries, merch, taille, zone) partent en `metadata` de la session.

## Emails (Resend)

Emails transactionnels via **Resend** :

| Événement | Route | Email |
|---|---|---|
| Inscription newsletter | `POST /api/newsletter` | Confirmation « Tu es dans la boucle » |
| Commande payée | `POST /api/stripe-webhook` (`checkout.session.completed`) | Confirmation commande (+ copie interne optionnelle) |

### Variables Vercel

| Variable | Requis | Exemple |
|---|---|---|
| `RESEND_API_KEY` | oui | `re_…` |
| `RESEND_FROM` | oui | `Starfobar × Ezéa <noreply@ton-domaine.com>` |
| `ORDER_NOTIFY_TO` | non | `contact@ezea.fr` |
| `STRIPE_SECRET_KEY` | oui (paiements) | `sk_test_…` / `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | oui (email commande) | `whsec_…` |
| `SITE_URL` | non | `https://starfobarxezea.com` |
| `BREVO_API_KEY` + `BREVO_LIST_ID` | non | liste contacts (en plus de Resend) |

### Checklist mise en ligne Resend

1. Créer un compte [Resend](https://resend.com) → API Key
2. **Domains** → domaine déjà branché : `starfobarxezea.com` (+ `www`)
3. Ajouter les enregistrements DNS (SPF / DKIM) indiqués par Resend → attendre **Verified**
4. Définir `RESEND_FROM` avec une adresse **sur ce domaine vérifié**
5. Coller `RESEND_API_KEY` + `RESEND_FROM` dans Vercel → Redeploy

Sans domaine vérifié, Resend ne laisse envoyer qu'à l'email du compte (mode test).

### Checklist Stripe webhook (email commande)

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL : `https://starfobarxezea.com/api/stripe-webhook`
3. Event : `checkout.session.completed`
4. Copier le **Signing secret** (`whsec_…`) → `STRIPE_WEBHOOK_SECRET` sur Vercel
5. Redeploy

En local : `stripe listen --forward-to localhost:3000/api/stripe-webhook`

## Newsletter (Brevo — optionnel)

Brevo reste **optionnel** pour stocker les contacts en liste.
Resend envoie l'email de confirmation même sans Brevo.
Si `BREVO_API_KEY` + `BREVO_LIST_ID` sont définis, le contact est aussi ajouté à la liste.

## Mettre à jour la disponibilité (sans chiffres)

Chaque carte série a un badge `.availability` avec 3 états :

- **Défaut** → `<div class="availability">…</div>` : « Encore quelques pièces en stock »
- **Dernières pièces** → `<div class="availability low">Dernières pièces</div>`
- **Sold out** → `<div class="availability sold">Sold out</div>`

Éditer le texte + la classe du badge dans `index.html` pour la série concernée.

## Changer une image

- **Photo produit** (vignette + 1re image modale) : `assets/sculptures/{serie}.jpg`.
  ⚠️ Si tu remplaces un fichier **au même nom**, bump le `?v=N` sur ses URLs
  (`index.html` + `js/starfobar.js` + JSON-LD) — sinon le cache navigateur (immutable
  1 an) sert l'ancienne image.
- **Packaging / vitrine** (2e image modale) : `assets/sculptures/{serie}-case.jpg`.
- **Voiture d'inspiration** (fond de section + 3e image modale) : `assets/cars/{serie}.jpg`.
- Galerie modale configurée dans `js/starfobar.js` → `CONFIG.series.<serie>.images`.

## Vidéo

- **Bande ambiance** : `assets/video/ambiance-starfobar.mp4` / `.webm` (déjà en place).
- **Hero** : slot optionnel `assets/video/hero-garage.mp4` / `.webm` — si présent, le
  script l'active en autoplay muted sur desktop ; sinon fallback Ken Burns sur le poster.

## Historique

Extrait le 2026-07-20 du repo mutualisé `carnivalxezea` (où il coexistait avec la
landing Carnival sur la route `/starfobar`) pour devenir un projet autonome.
