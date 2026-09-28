# Hikari 光 — Académie de révision (6e)

Application de révision installable sur Android (PWA). Elle fonctionne hors ligne et garde toutes ses données sur le téléphone. Il n'y a ni compte, ni serveur, ni publicité.

## 1. Mise en ligne gratuite sur GitHub Pages (≈ 10 minutes, à faire une seule fois)

1. Crée un compte sur https://github.com, puis un dépôt **public** nommé par exemple `hikari`.
2. Dépose dans ce dépôt **tout le contenu** du dossier `hikari` : `index.html`, `sw.js`, `manifest.webmanifest`, et les dossiers `css/`, `js/`, `data/`, `icons/`. Tu peux les glisser dans *Add file → Upload files*.
3. Active la publication : *Settings → Pages → Branch : main / (root) → Save*.
4. Au bout d'une minute, l'application est en ligne à l'adresse `https://<ton-compte>.github.io/hikari/`.

Le HTTPS est obligatoire pour l'installation et le mode hors ligne. GitHub Pages le fournit automatiquement.

## 2. Installation sur le téléphone Android

1. Ouvre l'adresse dans **Chrome** sur le téléphone de ta fille.
2. Menu ⋮ → **Installer l'application** (ou *Ajouter à l'écran d'accueil*).
3. Au premier lancement : *Moi → Réglages → Protéger mes données contre l'effacement*.
4. Fais de temps en temps une sauvegarde : *Moi → Sauvegarde*. Attention, les photos n'y sont pas incluses.

## 3. Mettre à jour l'application

1. Remplace les fichiers modifiés dans le dépôt.
2. **Incrémente `VERSION` dans `sw.js`**, par exemple `hikari-2026-10-15a`.
3. La mise à jour arrive sur le téléphone à la deuxième ouverture de l'application.

Les progrès de ta fille sont conservés, car ils sont stockés sur le téléphone et non dans les fichiers.

## 4. Enrichir le contenu : les packs de leçon

La boucle prévue :

1. Ta fille ouvre le chapitre concerné. Si la leçon n'existe pas encore, elle la crée avec *Moi → Nouvelle leçon photo*, en cochant les points du programme.
2. Elle photographie ses pages de cours.
3. Elle touche **« Envoyer les photos pour enrichissement »**. Le message envoyé contient l'identifiant du chapitre (par exemple `u-fr-1727…`).
4. Tu envoies ces photos à Claude avec l'identifiant. Claude te rend un fichier `.json`.
5. Elle l'importe avec *Moi → Importer un pack de leçon*.

### Format (version 2 : chapitres → leçons)

```json
{
  "format": "hikari-pack",
  "version": 2,
  "id": "pack-2026-10-02-fr-origines",
  "title": "Récits des origines — leçon du 1er octobre",
  "created": "2026-10-02",
  "extend": [
    {
      "chapter": "fr-origines",
      "lessons": [
        {
          "id": "u-fr-origines-1790608280766",
          "title": "La tour de Babel",
          "refs": ["FR-CULT-01"],
          "note": "Notions vues en classe le 1er octobre.",
          "fiche": [ { "h": "Le mythe de Babel" }, { "p": "…" } ],
          "cards": [
            { "k": "f", "q": "Question par cœur", "a": "Réponse" },
            { "k": "q", "q": "QCM ?", "c": ["bonne réponse", "leurre 1", "leurre 2"], "a": 0, "x": "explication" },
            { "k": "i", "q": "Réponse à taper ?", "a": ["réponse", "variante acceptée"] },
            { "k": "s", "q": "Classe…", "bins": ["Boîte A", "Boîte B"], "items": [["étiquette", 0], ["autre", 1]] },
            { "k": "o", "q": "Remets dans l'ordre…", "items": ["premier", "deuxième", "troisième"] },
            { "k": "p", "q": "Associe…", "pairs": [["gauche", "droite"], ["gauche 2", "droite 2"]] }
          ],
          "events": [ { "y": -3300, "label": "Invention de l'écriture", "note": "Mésopotamie", "key": true } ],
          "places": [ { "id": "uruk", "n": "Uruk", "lon": 45.6, "lat": 31.3, "map": "medit" } ]
        }
      ]
    }
  ]
}
```

- **`extend[].lessons`** : une leçon qui porte le même `id` qu'une leçon existante est complétée. Ses nouvelles notions apparaissent dans l'encadré « Ajouts de ta prof ». Un nouvel `id` crée la leçon.
- **Identifiant de la leçon** : il est donné dans le message envoyé depuis l'application avec les photos. Les leçons créées par ta fille ont un identifiant de la forme `u-<chapitre>-<nombre>`.
- **`chapters`** crée un chapitre complet ou remplit un chapitre « plan ». Chaque chapitre porte ses `lessons`.
- **Types de cartes :**
  - `f` : par cœur ;
  - `q` : QCM ;
  - `i` : réponse à taper ;
  - `g` : générateur ;
  - `s` : classer ;
  - `o` : ordonner ;
  - `p` : associer.
- **Blocs de fiche :** `h`, `p`, `def`, `list`, `table`, `tip`, `fig`.
- **Mise en forme :** `**gras**`, `__souligné__`.
- **Cartes :** `world`, `medit`, `europe`.
- **Identifiants du programme :** ils sont listés dans `data/programme.js` et dans l'app sous *Moi → Programme officiel et couverture*.
- **Réimport :** réimporter un pack de même `id` le remplace.
- **Découpage :** les chapitres correspondent aux séquences de la prof, les leçons à une ou deux séances. Le plan des leçons à venir suit une progression type, non officielle. La leçon réelle de la prof fait foi, et on peut toujours en créer une nouvelle.

## 5. Ce qu'il faut savoir

- **Programmes suivis en 2026-2027 :**
  - français et maths : cycle 3, BO du 17/04/2025 ;
  - langues : BO du 29/05/2025 ;
  - EMC : BO du 13/06/2024 ;
  - histoire-géo : programme de 2015-2020, toujours en vigueur en 6e ;
  - sciences : programme de 2023, toujours en vigueur en 6e.

  Les nouveaux programmes d'histoire-géo et de sciences arrivent en 6e à la rentrée 2027. Les références sont listées dans *Moi → Sources*.
- **Nature des contenus :** ce sont des paraphrases rédigées par une IA, puis relues par une seconde relecture indépendante. **Une relecture parentale reste recommandée**, et la leçon de la prof fait toujours foi.
- **Ordre des chapitres :** aucune progression officielle ne fixe l'ordre des chapitres. C'est à ta fille de débloquer ceux qui ont commencé en classe.
- **Pas de rappels de notification :** ils demanderaient un serveur. La flamme et le Ki du jour servent de rappel.
