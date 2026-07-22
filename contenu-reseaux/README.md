# Contenu réseaux — Starfobar × Ezéa

Campagne d'écoulement des 87 sculptures résine · **15 publications sur 1 mois**.
Tout est **prêt à poster** : pour chaque post, une image finale (PNG) + un `caption.txt`
(texte + hashtags + consignes de stickers/lien). Chris n'a plus qu'à publier.

Site de vente (toujours en CTA / sticker lien) : **https://starfobarxezea.com**
Comptes à taguer : **@ezea.art** (Ezéa) · **@starfobar** (Chris)

---

## Calendrier

| #  | Jour  | Type          | Thème                      | Dossier                              |
|----|-------|---------------|----------------------------|--------------------------------------|
| 01 | J-7   | Story         | Teaser                     | `01_J-7_teaser/`                     |
| 02 | J-3   | Story         | Explication (87 pièces)    | `02_J-3_explication/`                |
| 03 | H-12  | Story         | Compte à rebours           | `03_H-12_countdown/`                 |
| 04 | J+1   | **Feed**      | Les 4 produits             | `04_J+1_feed_4produits/`             |
| 05 | J+1   | Story         | Produits · général         | `05_J+1_story_general/`              |
| 06 | J+3   | Story         | Jeu concours (pièce XL)    | `06_J+3_concours/`                   |
| 07 | J+6   | Story         | Produit 1 · Propaganda     | `07_J+6_produit-propaganda/`         |
| 08 | J+9   | Story         | Produit 2 · Racing         | `08_J+9_produit-racing/`             |
| 09 | J+12  | Story         | Produit 3 · Old School BMW | `09_J+12_produit-bmw/`               |
| 10 | J+15  | Story         | Le Pack (Duo/Full/Kit)     | `10_J+15_pack/`                      |
| 11 | J+18  | Story         | Jeu concours · relance     | `11_J+18_concours-relance/`          |
| 12 | J+22  | Story         | Produit 4 · Marlboro       | `12_J+22_produit-marlboro/`          |
| 13 | J+25  | Story         | Rappel J-5                 | `13_J+25_rappel-j5/`                 |
| 14 | J+28  | Story         | Rappel J-3                 | `14_J+28_rappel-j3/`                 |
| 15 | J+30  | **Feed**      | Closing + concours         | `15_J+30_closing/`                   |

---

## Formats des PNG

- **Stories** (`story.png`) : ratio 9:16, exportés en **2160 × 3840** (2× de 1080×1920 pour la netteté).
- **Feed** (`post.png`) : ratio 4:5, exportés en **2160 × 2700** (2× de 1080×1350).

Instagram accepte ces tailles et les rééchantillonne. Zone de sécurité des stories
respectée (textes clés dans la bande centrale, haut/bas laissés à l'UI Instagram).

## Comment publier

1. **Stories** : ouvrir la story, importer le `story.png`, puis **ajouter les stickers natifs
   Instagram** indiqués dans le `caption.txt` (lien, compte à rebours, sondage/question).
   Les zones en pointillés sur certains visuels indiquent où poser le sticker.
2. **Feed** (04 et 15) : importer le `post.png`, copier-coller la caption du `caption.txt`,
   **mettre le lien en bio** (`starfobarxezea.com`) et épingler un commentaire avec le lien direct.
3. Toujours taguer **@ezea.art** et **@starfobar**.

## Règles éditoriales (rappels du brief)

- ❌ Ne **jamais** écrire « livraison offerte » (mention retirée de l'offre).
- 📊 Stock **qualitatif** côté public (« dernières pièces », « bientôt sold-out ») — pas de compteur exact.
- 🎁 Concours (pièces XL) : règle par défaut proposée (follow + like + tag 2 potes) — à caler avec Chris.
- 🎨 Aucun visuel n'est réutilisé deux fois ; angles de sculpture et photos de voiture variés.

## Aperçu pour la page proposition

4 posts « léchés » à mettre en avant sur `starfobarxezea.com/proposition` :
`04_J+1_feed_4produits`, `07_J+6_produit-propaganda`, `06_J+3_concours`, `15_J+30_closing`.

---

## Régénérer / réajuster un visuel

Les sources HTML sont dans `templates/` (design system commun dans `templates/base.css`).
Pour ré-exporter après une modif de texte :

```bash
cd _tools
node render.mjs           # tout re-render
node render.mjs 07 12     # seulement certains posts (par id)
```

Le rendu utilise Chrome en headless via `puppeteer-core` (installé dans `_tools/`).
Les images sources proviennent de `../assets/` (repo Starfobar).
