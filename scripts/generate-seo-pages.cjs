/**
 * Génère les pages SEO/GEO (HTML statique).
 * Ne touche pas index.html.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://starfobarxezea.com';

const GRAPH = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://ezea.fr/#ezea',
      name: 'Ezéa',
      jobTitle: 'Sculpteur',
      description:
        "Ezéa est un sculpteur français installé à La Gaude, dans les Alpes-Maritimes, qui transforme des bombes de peinture aérosol en sculptures de collection coulées à la main en résine époxy.",
      url: 'https://ezea.fr',
      sameAs: ['https://instagram.com/ezea.art', 'https://ezea.fr'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'La Gaude',
        postalCode: '06610',
        addressRegion: 'Alpes-Maritimes',
        addressCountry: 'FR',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'Starfobar × Ezéa',
      inLanguage: 'fr-FR',
      publisher: { '@id': 'https://ezea.fr/#ezea' },
    },
  ],
};

const SERIES = [
  {
    slug: 'propaganda',
    nom: 'Propaganda Series',
    titreMeta: 'Propaganda Series — Sculpture bombe résine rose fluo · Starfobar x Ezéa',
    descriptionMeta:
      'Sculpture en résine 25 cm coulée à la main, série Propaganda. Inspirée d\'une BMW Série 1 aux codes graffiti. Édition limitée à 25 exemplaires numérotés. 190 €.',
    accroche:
      'La série Propaganda est une sculpture en résine de 25 cm inspirée de la BMW Série 1 du garage Starfobar, éditée à 25 exemplaires numérotés. Rose fluo, finition brillante, codes graffiti apparents.',
    corps: [
      "C'est la série la plus brute des quatre. Elle vient directement du mur : lettrage, superpositions, cette manière qu'a une surface de porter plusieurs couches de peinture sans qu'aucune n'efface la précédente. Pas de recherche d'équilibre, pas de finition sage.",
      "Le rose fluo n'est pas décoratif. C'est une couleur de bombe, une vraie, celle qu'on utilise parce qu'elle se voit de loin et qu'elle tient mal — un pigment qui se dégrade vite à la lumière et qui, dans la résine, ne bougera plus.",
    ],
    contenuLivraison: [
      'Une sculpture de 25 cm, résine époxy coulée à la main, socle intégré',
      'Finition brillante premium',
      'Numérotée à la main sur 25, signée Ezéa',
      "Certificat d'authenticité",
      "Coffret d'expédition sur mesure",
    ],
    univers: ['street', 'graffiti', 'underground', 'brut'],
    voitureOrigine: 'BMW Série 1, garage Starfobar',
    couleur: 'Rose fluo',
    finition: 'Brillante premium',
    sku: 'SF-EZ-04-PROP',
    image: '/assets/sculptures/propaganda.jpg?v=3',
    productName: 'Propaganda Series — Sculpture bombe résine',
    productDesc:
      'Sculpture en résine époxy de 25 cm coulée à la main, série Propaganda, inspirée d\'une BMW Série 1 du garage Starfobar. Édition limitée à 25 exemplaires numérotés.',
  },
  {
    slug: 'racing',
    nom: 'Racing Series',
    titreMeta: 'Racing Series — Sculpture bombe résine bleu blanc rouge · Starfobar x Ezéa',
    descriptionMeta:
      'Sculpture en résine 25 cm coulée à la main, série Racing. Inspirée d\'une BMW E36 drift et de l\'esthétique paddock. 25 exemplaires numérotés. 190 €.',
    accroche:
      'La série Racing est une sculpture en résine de 25 cm inspirée de la BMW E36 drift du garage Starfobar, éditée à 25 exemplaires numérotés. Bleu, blanc et rouge, finition brillante, composition en livrée.',
    corps: [
      "Une livrée de course, ce n'est pas de la décoration : c'est un système de lecture. Les couleurs séparent les zones, les blocs de sponsors structurent la carrosserie, et l'ensemble doit rester lisible à 200 km/h vu de loin. Ces règles-là, je les ai appliquées à une bombe de peinture.",
      "D'où la géométrie plus stricte que sur les trois autres séries. Les séparations sont nettes, les blocs alignés. C'est la série la plus construite du lot.",
    ],
    contenuLivraison: [
      'Une sculpture de 25 cm, résine époxy coulée à la main, socle intégré',
      'Finition brillante premium',
      'Numérotée à la main sur 25, signée Ezéa',
      "Certificat d'authenticité",
      "Coffret d'expédition sur mesure",
    ],
    univers: ['drift', 'street', 'race', 'classic'],
    voitureOrigine: 'BMW E36 drift, garage Starfobar',
    couleur: 'Bleu, blanc et rouge',
    finition: 'Brillante premium',
    sku: 'SF-EZ-04-RACE',
    image: '/assets/sculptures/racing.jpg?v=3',
    productName: 'Racing Series — Sculpture bombe résine',
    productDesc:
      'Sculpture en résine époxy de 25 cm coulée à la main, série Racing, inspirée d\'une BMW E36 drift du garage Starfobar. Édition limitée à 25 exemplaires numérotés.',
  },
  {
    slug: 'old-school-bmw',
    nom: 'Old School BMW',
    titreMeta: 'Old School BMW — Sculpture bombe résine navy et or · Starfobar x Ezéa',
    descriptionMeta:
      'Sculpture en résine 25 cm coulée à la main, série Old School. Inspirée d\'une BMW E28 sleeper, esprit OEM+. 25 exemplaires numérotés. 190 €.',
    accroche:
      'La série Old School BMW est une sculpture en résine de 25 cm inspirée de la BMW E28 du garage Starfobar, éditée à 25 exemplaires numérotés. Navy profond, liseré doré, finition brillante.',
    corps: [
      "Un « sleeper », en culture automobile, désigne une voiture d'apparence banale mais lourdement préparée sous le capot. Rien ne se voit de l'extérieur. C'est l'inverse exact de la logique d'exposition — on ne montre pas, on sait.",
      "C'est la série la plus retenue des quatre, et la plus difficile à réussir. Quand il n'y a qu'une couleur et un liseré, il ne reste plus rien pour rattraper une erreur. Le doré est posé à la main, ligne par ligne.",
    ],
    contenuLivraison: [
      'Une sculpture de 25 cm, résine époxy coulée à la main, socle intégré',
      'Finition brillante premium, détails dorés',
      'Numérotée à la main sur 25, signée Ezéa',
      "Certificat d'authenticité",
      "Coffret d'expédition sur mesure",
    ],
    univers: ['OEM+', 'heritage', 'sleeper', 'classic'],
    voitureOrigine: 'BMW E28, garage Starfobar',
    couleur: 'Navy et or',
    finition: 'Brillante premium, détails dorés',
    sku: 'SF-EZ-04-BMW',
    image: '/assets/sculptures/sleeper.jpg?v=3',
    productName: 'Old School BMW — Sculpture bombe résine',
    productDesc:
      'Sculpture en résine époxy de 25 cm coulée à la main, série Old School BMW, inspirée d\'une BMW E28 du garage Starfobar. Édition limitée à 25 exemplaires numérotés.',
  },
  {
    slug: 'starfobar-serie',
    nom: 'Starfobar Série',
    titreMeta: 'Starfobar Série — Sculpture bombe résine rouge et blanche · Starfobar x Ezéa',
    descriptionMeta:
      'Sculpture en résine 25 cm coulée à la main, série Starfobar. Inspirée d\'une BMW E30 en livrée de course rouge et blanche. 25 exemplaires numérotés. 190 €.',
    accroche:
      'La Starfobar Série est une sculpture en résine de 25 cm inspirée de la BMW E30 du garage Starfobar, éditée à 25 exemplaires numérotés. Rouge et blanc, surface travaillée en froissé, finition brillante.',
    corps: [
      "Le milieu des années 80, c'est le moment où les livrées de course deviennent des images avant d'être des habillages. Deux couleurs, une diagonale, et une voiture devient reconnaissable en une fraction de seconde. Cette économie de moyens m'intéressait.",
      "Le froissé de la surface vient de là : une bombe qui a servi, qui est tombée, qu'on a écrasée. La couleur est neuve, l'objet ne l'est pas.",
    ],
    contenuLivraison: [
      'Une sculpture de 25 cm, résine époxy coulée à la main, socle intégré',
      'Finition brillante premium',
      'Numérotée à la main sur 25, signée Ezéa',
      "Certificat d'authenticité",
      "Coffret d'expédition sur mesure",
    ],
    univers: ['racing', 'vintage', 'legends'],
    voitureOrigine: 'BMW E30, garage Starfobar',
    couleur: 'Rouge et blanc',
    finition: 'Brillante premium',
    sku: 'SF-EZ-04-SF',
    // Asset existant — ne pas renommer (référencé par la home)
    image: '/assets/sculptures/marlboro.jpg?v=3',
    productName: 'Starfobar Série — Sculpture bombe résine',
    productDesc:
      'Sculpture en résine époxy de 25 cm coulée à la main, Starfobar Série, inspirée d\'une BMW E30 du garage Starfobar. Édition limitée à 25 exemplaires numérotés.',
  },
];

const FAQ = [
  {
    categorie: 'La collection',
    items: [
      {
        q: 'Qu\'est-ce que la collection Starfobar × Ezéa ?',
        a: 'Starfobar × Ezéa est une collection de 100 sculptures en résine réalisée en 2026 par le sculpteur français Ezéa pour le garage lyonnais Starfobar. Elle est répartie en quatre séries de 25 exemplaires numérotés, au format 25 cm, vendues 190 € pièce. Chaque série reprend l\'univers d\'une voiture précise du garage.',
      },
      {
        q: 'Combien de pièces ont été produites ?',
        a: 'Cent au total : quatre séries de vingt-cinq exemplaires. Chaque pièce est numérotée à la main sur 25. Aucune réédition n\'est prévue.',
      },
      {
        q: 'Quelle est la différence entre les quatre séries ?',
        a: 'Chaque série correspond à une voiture du garage Starfobar et à un univers distinct. Propaganda (rose fluo, codes graffiti) vient d\'une BMW Série 1 ; Racing (bleu blanc rouge, esthétique paddock) d\'une E36 drift ; Old School BMW (navy et or, esprit sleeper) d\'une E28 ; Starfobar Série (rouge et blanc) d\'une E30 en livrée de course.',
      },
      {
        q: 'Les pièces sont-elles encore disponibles ?',
        a: 'Il reste des pièces sur les quatre séries. Le stock est mis à jour au fil des ventes ; la mention de disponibilité figure sur chaque page série.',
      },
      {
        q: 'Y aura-t-il une réédition ou une Édition 05 ?',
        a: 'Pas de réédition de cette collection : les cent exemplaires sont les seuls qui existeront. Une future collaboration entre Ezéa et Starfobar reste possible mais n\'est pas annoncée à ce jour.',
      },
      {
        q: 'Est-ce que la valeur d\'une pièce peut augmenter ?',
        a: 'Personne ne peut le garantir, et personne ne devrait le promettre. Une sculpture Ezéa s\'achète parce qu\'elle plaît, pas comme un placement. Ce qui est vérifiable : l\'édition est limitée à 25 exemplaires par série, chaque pièce est numérotée, signée et certifiée, et il n\'y aura pas de réédition.',
      },
    ],
  },
  {
    categorie: "L'œuvre",
    items: [
      {
        q: 'En quoi sont faites les sculptures ?',
        a: "En résine époxy coulée à la main dans l'atelier d'Ezéa, à La Gaude dans les Alpes-Maritimes. Chaque pièce est ensuite poncée, peinte, finie et montée sur socle à la main.",
      },
      {
        q: 'Quelle est la taille exacte ?',
        a: "25 cm de hauteur, socle inclus. Le format correspond à celui d'une bombe de peinture aérosol standard.",
      },
      {
        q: 'Est-ce une vraie bombe de peinture ?',
        a: 'Non. Ce sont des sculptures en résine reproduisant la forme d\'une bombe aérosol. Elles ne contiennent ni gaz, ni peinture, ni mécanisme, et ne présentent aucun risque de pression ou d\'inflammabilité.',
      },
      {
        q: 'Deux pièces de la même série sont-elles identiques ?',
        a: 'Non. La coulée à la main produit des variations de teinte, de brillance et de texture d\'un exemplaire à l\'autre. Ces différences sont inhérentes au procédé et font partie de l\'objet.',
      },
      {
        q: 'Comment entretenir une sculpture en résine époxy ?',
        a: 'Un chiffon microfibre sec ou légèrement humide suffit. Éviter les produits solvantés, l\'alcool et les abrasifs, qui attaquent la finition brillante.',
      },
      {
        q: 'La résine époxy jaunit-elle avec le temps ?',
        a: 'Une résine époxy peut jaunir sous exposition prolongée aux UV. Pour préserver les couleurs, ne pas placer la sculpture en plein soleil direct ni contre une source de chaleur.',
      },
      {
        q: "À quoi sert le certificat d'authenticité ?",
        a: "Il identifie la série, le numéro d'exemplaire et l'année de réalisation, et il est signé par l'artiste. Il est indissociable de l'œuvre : conservez-le, notamment en cas de revente.",
      },
      {
        q: 'Puis-je commander une pièce sur mesure ?',
        a: 'Les pièces sur mesure et les commandes en volume se traitent au cas par cas, par email à contact@ezea.fr. Elles ne relèvent pas de cette collection et font l\'objet de conditions distinctes.',
      },
      {
        q: 'Puis-je photographier et publier ma pièce ?',
        a: "Oui, à titre privé et non commercial, en mentionnant l'artiste (@ezea.art). Toute utilisation commerciale, publicitaire ou dérivée nécessite une autorisation écrite : l'achat transfère la propriété de l'objet, pas les droits d'auteur.",
      },
    ],
  },
  {
    categorie: 'Achat, paiement, livraison',
    items: [
      {
        q: 'Combien coûte une sculpture ?',
        a: '190 € la pièce, hors frais de livraison. Des combos existent : 340 € pour deux sculptures, 680 € pour les quatre séries avec coffret, 229 € pour une sculpture accompagnée d\'un textile Starfobar.',
      },
      {
        q: "Puis-je choisir mon numéro d'exemplaire ?",
        a: "Les numéros sont attribués dans l'ordre des commandes. Pour une demande particulière, écrivez à contact@ezea.fr avant de commander : si le numéro est encore disponible, il sera réservé.",
      },
      {
        q: 'La pièce livrée est-elle exactement celle de la photo ?',
        a: 'Les visuels du site présentent la série, pas l\'exemplaire précis. Comme chaque pièce est coulée à la main, des variations existent. Vous pouvez demander par email les photographies réelles d\'une pièce disponible avant de commander.',
      },
      {
        q: 'Quels moyens de paiement sont acceptés ?',
        a: 'Le paiement s\'effectue via Stripe : cartes bancaires et portefeuilles électroniques. Les données bancaires sont traitées directement par Stripe et ne transitent jamais par le vendeur.',
      },
      {
        q: 'Quels sont les délais de livraison ?',
        a: '3 à 7 jours ouvrés pour la France métropolitaine, 5 à 10 jours pour l\'Union européenne, 7 à 15 jours hors UE / international. Un numéro de suivi est envoyé à l\'expédition.',
      },
      {
        q: 'Comment la sculpture est-elle emballée ?',
        a: "Dans un coffret d'expédition conçu pour le transport, avec protection intégrale. L'envoi se fait en suivi et assuré.",
      },
      {
        q: 'Que faire si le colis arrive endommagé ?',
        a: 'Émettez des réserves précises sur le bon de livraison, refusez le colis si nécessaire, et écrivez à contact@ezea.fr sous 3 jours ouvrés avec des photos du colis et de son contenu. La pièce est remplacée ou remboursée.',
      },
      {
        q: 'Puis-je retourner une sculpture ?',
        a: "Oui. Vous disposez de 14 jours à compter de la réception pour vous rétracter, sans justification. La pièce doit être retournée complète, dans son emballage d'origine, avec son certificat ; les frais de retour sont à votre charge.",
      },
      {
        q: 'Livrez-vous à l\'étranger ?',
        a: 'Oui : France métropolitaine (9,90 €), Union européenne (19,90 €) et international (29,90 €). Pour les livraisons hors UE, les droits de douane sont à la charge du destinataire.',
      },
      {
        q: 'Peut-on venir chercher une pièce sur place ?',
        a: "L'atelier d'Ezéa se situe à La Gaude, dans les Alpes-Maritimes, et se visite sur rendez-vous. Écrivez à contact@ezea.fr pour organiser un retrait.",
      },
      {
        q: 'Le textile inclus dans le Kit Starfobar, comment ça marche ?',
        a: 'Le Kit associe une sculpture au choix et un textile officiel Starfobar (t-shirt, jersey ou hoodie), pour 229 € au lieu de 249 €. La taille et le modèle se choisissent à la commande, dans la limite des disponibilités.',
      },
    ],
  },
  {
    categorie: 'Les acteurs',
    items: [
      {
        q: 'Qui est Ezéa ?',
        a: 'Ezéa est un sculpteur français installé à La Gaude, dans les Alpes-Maritimes, qui transforme des bombes de peinture aérosol en sculptures de collection coulées à la main en résine époxy. Son travail est diffusé par huit galeries partenaires en France et en Suisse.',
      },
      {
        q: 'Qui est Starfobar ?',
        a: 'Starfobar est un garage automobile basé à Lyon, animé par Chris, spécialisé dans la préparation et la culture drift, street, race et classic. Sa communauté compte 232 000 abonnés sur Instagram.',
      },
      {
        q: "Où l'événement Édition 04 a-t-il eu lieu ?",
        a: "L'événement Starfobar Édition 04 s'est tenu les 4 et 5 juillet 2026 près de Lyon. La collection Starfobar × Ezéa y a été présentée et vendue pour la première fois, sur un corner dédié.",
      },
    ],
  },
];

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonLd(...objs) {
  const scripts = objs
    .map(
      (o) =>
        `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`
    )
    .join('\n');
  return scripts;
}

function shell({ title, description, canonical, current, robots, body, schemas, cssPrefix = '' }) {
  const cssHref = cssPrefix + '/css/seo-pages.css';
  const nav = [
    ['/collection/propaganda', 'Collection'],
    ['/histoire', 'Histoire'],
    ['/ezea', 'Ezéa'],
    ['/faq', 'FAQ'],
    ['/journal', 'Journal'],
  ]
    .map(([href, label]) => {
      const cur =
        current === href ||
        (label === 'Collection' && current && current.startsWith('/collection/')) ||
        (label === 'Journal' && current && current.startsWith('/journal'));
      return `<a href="${href}"${cur ? ' aria-current="page"' : ''}>${label}</a>`;
    })
    .join('\n      ');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${robots || 'index, follow'}">
<link rel="canonical" href="${SITE}${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE}${canonical}">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${cssHref}">
${jsonLd(GRAPH, ...(schemas || []))}
</head>
<body>
<div class="stripe"><i></i><i></i><i></i></div>
<header class="top">
  <div class="wrap-wide">
    <a class="brand" href="/">STARFOBAR<span>×</span>EZÉA</a>
    <a class="back" href="/">← Retour au garage</a>
  </div>
</header>
<nav class="subnav wrap-wide" aria-label="Navigation secondaire">
      ${nav}
</nav>
${body}
<footer class="page-foot">
  <div class="wrap-wide">
    <p>© 2026 Ezéa · Original Hand Artwork · SF·EZ·04·2026</p>
    <nav>
      <a href="/">Le garage</a>
      <a href="/mentions-legales">Mentions légales</a>
      <a href="/cgv">CGV</a>
      <a href="mailto:contact@ezea.fr">Contact</a>
      <a href="https://ezea.fr">ezea.fr</a>
    </nav>
  </div>
</footer>
</body>
</html>
`;
}

function authorBox() {
  return `<aside class="author-box">
  <p><strong>Ezéa</strong> — Sculpteur, La Gaude (06). Ezéa transforme des bombes de peinture aérosol en sculptures de collection coulées à la main en résine époxy. Son travail est diffusé par huit galeries partenaires en France et en Suisse. Atelier ouvert sur rendez-vous.</p>
  <div class="links">
    <a href="https://ezea.fr">ezea.fr</a>
    <a href="https://instagram.com/ezea.art" target="_blank" rel="noopener">@ezea.art</a>
  </div>
</aside>`;
}

function write(rel, html) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, 'utf8');
  console.log('wrote', rel);
}

// --- Collection pages ---
for (const s of SERIES) {
  const others = SERIES.filter((x) => x.slug !== s.slug);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Collection', item: SITE + '/collection/' + s.slug },
      { '@type': 'ListItem', position: 3, name: s.nom, item: SITE + '/collection/' + s.slug },
    ],
  };
  const product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: s.productName,
    description: s.productDesc,
    image: SITE + s.image.replace(/\?v=3$/, ''),
    url: SITE + '/collection/' + s.slug,
    sku: s.sku,
    brand: { '@type': 'Brand', name: 'Starfobar × Ezéa' },
    creator: { '@id': 'https://ezea.fr/#ezea' },
    material: 'Résine époxy',
    height: { '@type': 'QuantitativeValue', value: 25, unitCode: 'CMT' },
    isFamilyFriendly: true,
    offers: {
      '@type': 'Offer',
      price: '190.00',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: SITE + '/collection/' + s.slug,
      seller: { '@id': 'https://ezea.fr/#ezea' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'FR' },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'FR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
      },
    },
  };

  const body = `<div class="wrap">
  <div class="hero">
    <nav class="crumbs" aria-label="Fil d'ariane"><a href="/">Accueil</a> › Collection › ${esc(s.nom)}</nav>
    <div class="eyebrow">Collection · 190 €</div>
    <h1>${esc(s.nom)}</h1>
  </div>
</div>
<main class="wrap prose">
  <img class="serie-img" src="${esc(s.image)}" alt="Sculpture bombe ${esc(s.nom)}, ${esc(s.couleur)}" width="420" height="420">
  <p class="lead">${esc(s.accroche)}</p>
  ${s.corps.map((p) => `<p>${esc(p)}</p>`).join('\n  ')}
  <div class="availability"><span class="dot"></span>Encore quelques pièces en stock</div>
  <div class="fiche">
    <dl>
      <dt>Univers</dt><dd>${esc(s.univers.join(' · '))}</dd>
      <dt>Voiture d'origine</dt><dd>${esc(s.voitureOrigine)}</dd>
      <dt>Couleur</dt><dd>${esc(s.couleur)}</dd>
      <dt>Finition</dt><dd>${esc(s.finition)}</dd>
      <dt>Format</dt><dd>25 cm, socle intégré</dd>
      <dt>Édition</dt><dd>25 exemplaires numérotés</dd>
      <dt>Prix</dt><dd>190 €</dd>
    </dl>
  </div>
  <div class="receive">
    <h2>Ce que vous recevez</h2>
    <ul>${s.contenuLivraison.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
  </div>
  <div class="cta-row">
    <a class="cta-primary" href="/#combos">Acquérir cette pièce — 190 €</a>
    <a class="cta-secondary" href="/faq">FAQ</a>
    <a class="cta-secondary" href="/histoire">L'histoire</a>
  </div>
  <h2>Les autres séries</h2>
  <div class="related">
    ${others
      .map(
        (o) =>
          `<a href="/collection/${o.slug}"><span>Série</span>${esc(o.nom)}</a>`
      )
      .join('\n    ')}
  </div>
</main>`;

  write(
    `collection/${s.slug}.html`,
    shell({
      title: s.titreMeta,
      description: s.descriptionMeta,
      canonical: `/collection/${s.slug}`,
      current: `/collection/${s.slug}`,
      body,
      schemas: [product, breadcrumb],
      cssPrefix: '..',
    })
  );
}

// Fix CSS path for nested pages - shell uses cssPrefix
// collection pages need ../css - I passed cssPrefix: '..' but href is cssPrefix + '/css/...' = '../css/seo-pages.css' ✓

// --- Histoire ---
write(
  'histoire.html',
  shell({
    title: "L'histoire de la collab Starfobar x Ezéa — 100 sculptures pour un garage",
    description:
      "Comment 100 sculptures en résine sont nées des voitures du garage Starfobar. L'histoire de la collaboration entre Chris et le sculpteur Ezéa, de la rencontre à l'événement Édition 04.",
    canonical: '/histoire',
    current: '/histoire',
    body: `<div class="wrap">
  <div class="hero prose">
    <div class="eyebrow">Histoire</div>
    <h1>Comment 100 sculptures sont nées dans un garage lyonnais</h1>
    <p class="chapo lead">La collection Starfobar × Ezéa est née d'une idée simple : traduire chaque voiture d'un garage en sculpture. Quatre séries de vingt-cinq pièces, cent bombes de peinture en résine, chacune reprenant les codes, les couleurs et l'univers d'une voiture précise du garage de Chris à Lyon. La collection a été lancée les 4 et 5 juillet 2026, à l'événement Starfobar Édition 04.</p>
  </div>
</div>
<main class="wrap prose">
  <h2>Le garage d'abord</h2>
  <p>Starfobar, c'est Chris. Un garage à Lyon, plus de dix ans de préparations, et une communauté de 232 000 personnes sur Instagram qui suit ce qui s'y passe. Drift, street, race, classic — quatre univers qui cohabitent sous le même toit, ce qui est rare. La plupart des garages choisissent un camp.</p>
  <p>C'est ce mélange qui a donné la structure de la collection. Je n'ai pas cherché un thème : je suis parti des voitures. Chacune avait déjà son identité, ses couleurs, son histoire. Il fallait juste les transposer.</p>

  <h2>Pourquoi une bombe de peinture</h2>
  <p class="lead">Je sculpte des bombes de peinture aérosol depuis le début de mon travail.</p>
  <p>C'est l'objet du graffiti, l'outil de base de la culture dans laquelle j'ai grandi. Le figer dans la résine, c'est arrêter un geste qui, par définition, ne dure pas.</p>
  <p>Le rapprochement avec la culture auto n'était pas évident au départ. Il l'est devenu très vite : ce sont deux mondes qui parlent le même langage. La livrée d'une voiture de course et un mur peint, c'est la même chose — un support qu'on couvre pour dire quelque chose. Les gens qui préparent leurs voitures et ceux qui peignent des murs partagent le même rapport à l'objet : on ne le laisse pas dans l'état où on l'a trouvé.</p>

  <h2>Les quatre séries</h2>
  <p>Chaque série correspond à une voiture du garage.</p>
  <ul>
    <li><strong>Propaganda</strong> — la BMW Série 1, l'univers le plus brut. Rose fluo, codes graffiti, rien de policé.</li>
    <li><strong>Racing</strong> — la BMW E36 drift, bleu blanc rouge, esthétique paddock et sponsors techniques.</li>
    <li><strong>Old School BMW</strong> — la E28, navy et liseré doré. La série sleeper : discrète dehors, préparée dedans.</li>
    <li><strong>Starfobar Série</strong> — la E30, rouge et blanc, hommage aux livrées de course des années 80.</li>
  </ul>
  <p>Vingt-cinq exemplaires chacune. Pas vingt-six.</p>

  <h2>Comment elles sont faites</h2>
  <p class="lead">Chaque sculpture est coulée à la main en résine époxy, dans mon atelier de La Gaude, dans les Alpes-Maritimes.</p>
  <p>Le processus prend plusieurs jours par pièce : moulage, coulée, démoulage, ponçage, peinture, finition, socle, signature, numérotation.</p>
  <p>Ça veut dire que deux pièces d'une même série ne sont jamais rigoureusement identiques. Une nuance de teinte, une bulle, un reflet qui prend différemment. Je ne cherche pas à corriger ça. C'est ce qui différencie une pièce coulée à la main d'un objet sorti d'une chaîne.</p>

  <h2>L'événement des 4 et 5 juillet 2026</h2>
  <p class="lead">La collection a été présentée pour la première fois à l'événement Starfobar Édition 04, sur un corner dédié, les 4 et 5 juillet 2026.</p>
  <p>Les quatre séries y étaient exposées et vendues sur place, à côté des voitures qui les avaient inspirées.</p>
  <p>C'était la première fois que je voyais les pièces dans leur contexte d'origine — pas sur une étagère d'atelier, mais à trois mètres de la E30 qui avait donné la Starfobar Série. Beaucoup de gens sont repartis avec une pièce ce week-end-là.</p>
  <p>Il en reste. C'est pour ça que cette page existe.</p>

  <h2>Ce qui reste</h2>
  <p>Les pièces encore disponibles sont numérotées, signées, et livrées avec leur certificat d'authenticité. Une fois les cent parties, il n'y aura pas de réédition. Ni sous ce nom, ni sous un autre.</p>
  <p class="lead">Une pièce unique XXL a été réalisée pour le garage de Chris. Elle n'a jamais été mise en vente et ne le sera pas.</p>
  ${authorBox()}
</main>`,
  })
);

// --- Ezéa ---
write(
  'ezea.html',
  shell({
    title: 'Ezéa, le sculpteur derrière la collection',
    description:
      'Ezéa est un sculpteur français installé à La Gaude qui transforme des bombes de peinture aérosol en sculptures de collection coulées à la main en résine époxy.',
    canonical: '/ezea',
    current: '/ezea',
    body: `<div class="wrap">
  <div class="hero prose">
    <div class="eyebrow">L'artiste</div>
    <h1>Qui est Ezéa</h1>
  </div>
</div>
<main class="wrap prose">
  <p class="lead">Ezéa est un sculpteur français installé à La Gaude, dans les Alpes-Maritimes, qui transforme des bombes de peinture aérosol en sculptures de collection coulées à la main en résine époxy. Chaque pièce est posée sur socle, signée, numérotée et accompagnée d'un certificat d'authenticité.</p>
  <p>Son travail est né de la scène graffiti. La bombe de peinture y est l'outil de base ; la figer dans la résine revient à arrêter un geste qui, par nature, est éphémère. D'où la formule qui accompagne son travail : <strong>Stop the Motion. Own the Moment.</strong></p>
  <p>Ezéa travaille depuis son atelier de La Gaude, ouvert sur rendez-vous. Ses pièces sont diffusées par huit galeries partenaires en France et en Suisse, et il a présenté son travail à l'Antibes Art Fair. Une de ses sculptures apparaît dans le court-métrage <em>La Veuve et le Voleur</em> de Christophe Prévité.</p>
  <p>En dehors de Starfobar, il a signé une collaboration avec la marque <strong>Carnival Sun Juice</strong> et travaille aux côtés d'artistes de la scène urbaine française, dont <strong>Bruno Graffer</strong>.</p>
  <p class="lead">→ Le travail complet, l'atelier et les autres séries : <a href="https://ezea.fr">ezea.fr</a></p>
</main>`,
  })
);

// --- FAQ ---
const faqMainEntity = FAQ.flatMap((cat) =>
  cat.items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  }))
);
const faqHtml = FAQ.map(
  (cat) =>
    `<div class="faq-cat">${esc(cat.categorie)}</div>
${cat.items
  .map(
    (item) => `<details class="faq-item">
  <summary>${esc(item.q)}</summary>
  <div class="answer"><p>${esc(item.a)}</p></div>
</details>`
  )
  .join('\n')}`
).join('\n');

write(
  'faq.html',
  shell({
    title: 'FAQ — Collection Starfobar x Ezéa : achat, livraison, authenticité',
    description:
      'Toutes les questions sur les sculptures Starfobar x Ezéa : prix, disponibilité, livraison, retour, certificat d\'authenticité, entretien de la résine.',
    canonical: '/faq',
    current: '/faq',
    schemas: [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqMainEntity }],
    body: `<div class="wrap">
  <div class="hero prose">
    <div class="eyebrow">FAQ</div>
    <h1>Questions fréquentes</h1>
    <p class="chapo">Starfobar × Ezéa est une collection de 100 sculptures en résine réalisée en 2026 par l'artiste Ezéa pour le garage lyonnais Starfobar, répartie en quatre séries de 25 exemplaires numérotés, au format 25 cm, vendues 190 € pièce.</p>
  </div>
</div>
<main class="wrap prose">
${faqHtml}
</main>`,
  })
);

console.log('FAQ questions:', faqMainEntity.length);

// --- Journal articles ---
const articles = [
  {
    slug: 'retour-evenement-starfobar-edition-04',
    titre: 'Starfobar Édition 04 : ce qui s\'est passé les 4 et 5 juillet',
    titreMeta: 'Starfobar Édition 04 : retour sur les 4 et 5 juillet 2026',
    descriptionMeta:
      'La collection Starfobar x Ezéa a été présentée pour la première fois lors de l\'événement Édition 04, les 4 et 5 juillet 2026 près de Lyon. Retour sur le week-end.',
    datePublication: '2026-07-22',
    dateModification: '2026-07-22',
    chapo:
      'Les 4 et 5 juillet 2026, la collection Starfobar × Ezéa a été présentée pour la première fois lors de l\'événement Starfobar Édition 04, près de Lyon. Les quatre séries — 100 sculptures en résine coulées à la main — y étaient exposées et vendues sur un corner dédié, à côté des voitures qui les avaient inspirées.',
    corps: [
      { type: 'h2', contenu: 'Le montage' },
      {
        type: 'p',
        contenu:
          "Sortir cent pièces en résine d'un atelier des Alpes-Maritimes pour les amener près de Lyon, c'est un exercice logistique plus qu'artistique. Chaque sculpture voyage dans son coffret. Aucune casse sur le trajet.",
      },
      {
        type: 'p',
        contenu:
          'Le corner a été monté le vendredi. Les quatre séries alignées, chacune face à sa voiture de référence : la Série 1 pour Propaganda, la E36 pour Racing, la E28 pour Old School, la E30 pour la Starfobar Série.',
      },
      { type: 'h2', contenu: "Ce que j'ai appris sur place" },
      { type: 'p', contenu: "Trois choses que je n'aurais pas devinées depuis l'atelier." },
      {
        type: 'p',
        contenu:
          "Les gens touchent avant de regarder. La finition brillante appelle la main. Une pièce qu'on ne peut pas prendre en main ne se vend pas.",
      },
      {
        type: 'p',
        contenu:
          "La série préférée n'est jamais celle qu'on prévoit. J'avais parié sur Propaganda, la plus voyante. Sur place, ce sont les séries plus retenues qui ont surpris. La discrétion se vend mieux que je ne le pensais.",
      },
      {
        type: 'p',
        contenu:
          "La voiture à côté change tout. Une sculpture posée seule est un objet décoratif. La même, à trois mètres de la voiture dont elle vient, devient une traduction. Les gens comprenaient l'idée sans que j'aie besoin de l'expliquer.",
      },
      { type: 'h2', contenu: 'Ce qui reste' },
      {
        type: 'p',
        contenu:
          "Beaucoup de pièces sont parties ce week-end-là. Il en reste sur les quatre séries, disponibles ici. Une fois les cent exemplaires écoulés, il n'y aura pas de réédition.",
      },
      {
        type: 'p',
        contenu:
          'Une pièce unique au format XXL a été réalisée spécialement pour le garage de Chris. Elle n\'a jamais été mise en vente.',
      },
      {
        type: 'p',
        contenu: 'Merci à Chris et à toute l\'équipe Starfobar. Photos : Joff Lign.',
      },
    ],
  },
  {
    slug: 'comment-est-fabriquee-une-sculpture-ezea',
    titre: 'De la bombe au socle : comment je fabrique une sculpture',
    titreMeta: 'Comment est fabriquée une sculpture en résine Ezéa, étape par étape',
    descriptionMeta:
      "De la bombe de peinture d'origine au socle signé : les 7 étapes de fabrication d'une sculpture en résine époxy coulée à la main dans l'atelier d'Ezéa.",
    datePublication: '2026-07-22',
    dateModification: '2026-07-22',
    chapo:
      'Une sculpture Ezéa est une pièce en résine époxy coulée à la main, produite en sept étapes réparties sur plusieurs jours. Voici le processus complet, tel qu\'il se déroule à l\'atelier de La Gaude.',
    corps: [
      {
        type: 'p',
        contenu:
          "1. L'objet d'origine. Tout part d'une bombe de peinture aérosol réelle. C'est elle qui donne la forme, les proportions, les détails de surface — la nervure du corps, le pas de vis, l'embase. Sur certaines séries, la bombe est travaillée avant moulage : froissée, cabossée, marquée.",
      },
      {
        type: 'p',
        contenu:
          "2. Le moule. Un moule en silicone est réalisé à partir de l'objet. Il capte les détails jusqu'au dixième de millimètre. Un moule s'use : après un certain nombre de coulées, il faut en refaire un.",
      },
      {
        type: 'p',
        contenu:
          "3. La coulée. La résine époxy est dosée, mélangée à son durcisseur, teintée, puis coulée. C'est l'étape la plus sensible : une erreur de dosage, une température ambiante trop basse, un mélange trop rapide qui emprisonne de l'air, et la pièce est perdue.",
      },
      {
        type: 'p',
        contenu:
          "4. La polymérisation. La résine durcit pendant plusieurs heures. On ne peut pas accélérer. C'est ce qui rend impossible la production en volume : le temps de prise est le temps de prise.",
      },
      {
        type: 'p',
        contenu:
          "5. Le démoulage et le ponçage. La pièce sort brute. Elle est ébarbée, poncée par passes successives de grains décroissants. C'est l'étape la plus longue et la moins spectaculaire.",
      },
      {
        type: 'p',
        contenu:
          '6. La finition. Peinture, détails, liseré doré sur la série Old School. Puis le vernis qui donne la brillance. Chaque couche doit sécher avant la suivante.',
      },
      {
        type: 'p',
        contenu:
          '7. Le socle, la signature, le numéro. Montage sur socle, signature à la main, numérotation sur 25, rédaction du certificat d\'authenticité.',
      },
      { type: 'h2', contenu: "Pourquoi ça ne peut pas être industrialisé" },
      {
        type: 'p',
        contenu:
          "À chaque étape, une pièce peut être perdue. Le taux de rebut est réel et il fait partie du coût. C'est aussi la raison pour laquelle deux sculptures d'une même série ne sont jamais identiques : la teinte varie légèrement d'une coulée à l'autre, le ponçage à la main ne donne jamais exactement la même surface.",
      },
      {
        type: 'p',
        contenu:
          "Je ne cherche pas à corriger ces écarts. Un objet parfaitement homogène, c'est un objet moulé en série. Ce n'est pas ce que je fais.",
      },
    ],
  },
  {
    slug: 'pourquoi-une-livree-de-course-fait-une-bonne-sculpture',
    titre: 'Ce que le graffiti et les livrées de course ont en commun',
    titreMeta: 'Pourquoi une livrée de course fait une bonne sculpture',
    descriptionMeta:
      'Livrées de course et graffiti obéissent aux mêmes règles : lisibilité immédiate, économie de moyens, surface qui raconte. Pourquoi la culture auto et le street art se répondent.',
    datePublication: '2026-07-22',
    dateModification: '2026-07-22',
    chapo:
      "Une livrée de course et un graffiti obéissent aux mêmes contraintes : être lisibles instantanément, avec un minimum d'éléments, sur une surface qu'on ne choisit pas. C'est de ce constat qu'est née la collection Starfobar × Ezéa.",
    corps: [
      { type: 'h2', contenu: 'La lisibilité à grande vitesse' },
      {
        type: 'p',
        contenu:
          "Une livrée doit être identifiable en une fraction de seconde, de loin, en mouvement. D'où les grands aplats, les diagonales franches, les contrastes forts. Aucune subtilité : la subtilité est illisible à 200 km/h.",
      },
      {
        type: 'p',
        contenu:
          'Un graffiti sur un train ou un mur longé en voiture obéit exactement à la même règle. On le voit deux secondes. S\'il faut le déchiffrer, il a raté.',
      },
      { type: 'h2', contenu: 'La contrainte comme moteur' },
      {
        type: 'p',
        contenu:
          'Le peintre de livrée ne choisit pas la forme de la carrosserie. Le graffeur ne choisit pas le mur. Les deux composent avec une surface donnée, ses accidents, ses ouvertures, ses reliefs.',
      },
      {
        type: 'p',
        contenu:
          "C'est exactement ce que fait une sculpture de bombe de peinture. La forme est imposée — corps cylindrique, épaulement, embase. Il faut composer dessus.",
      },
      { type: 'h2', contenu: "L'objet qui a servi" },
      {
        type: 'p',
        contenu:
          "Un des points communs les moins évidents : dans les deux cultures, un objet neuf est moins intéressant qu'un objet qui a vécu. Une voiture de course couverte de gomme et de traces de piste est plus juste qu'une voiture sortie du polish. Une bombe cabossée, écrasée, dit quelque chose qu'une bombe neuve ne dit pas.",
      },
      {
        type: 'p',
        contenu:
          "C'est pourquoi certaines de mes pièces sont froissées avant moulage. La couleur est neuve, l'objet ne l'est pas.",
      },
      { type: 'h2', contenu: 'Ce que ça donne dans les quatre séries' },
      {
        type: 'liste',
        contenu: [
          'Propaganda applique la logique du mur : superpositions, aucune couche n\'efface la précédente.',
          'Racing applique celle du paddock : blocs, séparations nettes, structure.',
          'Old School BMW applique celle du sleeper : un seul liseré, aucun droit à l\'erreur.',
          'Starfobar Série applique celle des années 80 : deux couleurs, une diagonale, une image reconnaissable immédiatement.',
        ],
      },
      { type: 'p', contenu: 'Quatre grammaires différentes, un seul objet.' },
    ],
  },
];

function renderBlocs(blocs) {
  return blocs
    .map((b) => {
      if (b.type === 'h2') return `<h2>${esc(b.contenu)}</h2>`;
      if (b.type === 'liste')
        return `<ul>${b.contenu.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
      return `<p>${esc(b.contenu)}</p>`;
    })
    .join('\n  ');
}

function fmtDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

for (const a of articles) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.titreMeta,
    description: a.descriptionMeta,
    author: { '@id': 'https://ezea.fr/#ezea' },
    publisher: { '@id': 'https://ezea.fr/#ezea' },
    datePublished: a.datePublication,
    dateModified: a.dateModification,
    inLanguage: 'fr-FR',
    mainEntityOfPage: SITE + '/journal/' + a.slug,
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: SITE + '/journal' },
      { '@type': 'ListItem', position: 3, name: a.titre, item: SITE + '/journal/' + a.slug },
    ],
  };

  write(
    `journal/${a.slug}.html`,
    shell({
      title: a.titreMeta,
      description: a.descriptionMeta,
      canonical: `/journal/${a.slug}`,
      current: `/journal/${a.slug}`,
      schemas: [articleSchema, breadcrumb],
      cssPrefix: '..',
      body: `<div class="wrap">
  <div class="hero prose">
    <nav class="crumbs" aria-label="Fil d'ariane"><a href="/">Accueil</a> › <a href="/journal">Journal</a> › Article</nav>
    <div class="eyebrow">Journal · Par Ezéa</div>
    <h1>${esc(a.titre)}</h1>
    <p class="meta-dates">Publié le ${fmtDate(a.datePublication)} · Modifié le ${fmtDate(a.dateModification)}</p>
  </div>
</div>
<main class="wrap prose">
  <p class="lead">${esc(a.chapo)}</p>
  ${renderBlocs(a.corps)}
  ${authorBox()}
</main>`,
    })
  );
}

write(
  'journal.html',
  shell({
    title: 'Journal — Starfobar x Ezéa',
    description:
      'Actualités, coulisses et fabrication de la collection Starfobar × Ezéa : événement Édition 04, atelier, livrées et graffiti.',
    canonical: '/journal',
    current: '/journal',
    body: `<div class="wrap">
  <div class="hero prose">
    <div class="eyebrow">Journal</div>
    <h1>Le journal de la collection</h1>
    <p class="chapo">Coulisses, fabrication et retour d'événement — écrits par Ezéa.</p>
  </div>
</div>
<main class="wrap prose">
  <ul class="journal-list">
    ${articles
      .map(
        (a) => `<li>
      <time datetime="${a.datePublication}">${fmtDate(a.datePublication)}</time>
      <h2><a href="/journal/${a.slug}">${esc(a.titre)}</a></h2>
      <p>${esc(a.descriptionMeta)}</p>
    </li>`
      )
      .join('\n    ')}
  </ul>
</main>`,
  })
);

console.log('done');
