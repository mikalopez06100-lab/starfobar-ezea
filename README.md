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
  newsletter.js       → POST /api/newsletter → inscription Brevo
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

### ⚠️ À faire au moment de brancher le domaine

Les URLs absolues (canonical, Open Graph, Twitter Card, JSON-LD) utilisent le
**placeholder `https://starfobar-ezea.com`**. Remplacer par le vrai domaine dans :
`index.html` (balises `<link rel="canonical">`, `og:*`, `twitter:*`, JSON-LD `image`),
`robots.txt` et `sitemap.xml`.

## Brancher les paiements (Stripe Payment Links)

1. Dashboard Stripe → **Payment Links** → créer 7 liens :
   - 4 séries à **190 €** : Propaganda, Racing, Old School BMW, Marlboro
   - 3 combos : Duo **340 €**, Full **680 €**, Kit **229 €**
2. Coller chaque URL dans `js/starfobar.js` → objet `CONFIG.paymentLinks`
   (remplacer le `null` par `'https://buy.stripe.com/...'`).
3. Tant qu'un lien vaut `null`, le bouton renvoie vers la capture email
   (« paiement en cours d'activation ») — **aucun paiement lancé**.

## Newsletter (Brevo)

Créer une liste Brevo `starfobar-ezea-audience`, puis définir `BREVO_API_KEY` et
`BREVO_LIST_ID` (voir `.env.example`, à configurer dans les env vars Vercel).
Sans ces variables, le formulaire répond « bientôt actif » sans erreur bloquante.

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
