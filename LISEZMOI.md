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
- **`messages`** (défis de papa) : `[{"id": "defi-2026-10-01", "from": "Papa", "text": "…", "until": "2026-10-05", "reward": {"text": "Un bubble tea", "emoji": "🧋", "surprise": true}, <type>}]`. Types : `"hard": 20` (cartes difficiles réussies, c'est-à-dire déjà ratées ou peu sûres), `"epreuve": {"n": 10, "pass": 8, "cards": "hard"}` (ses cartes les plus dures) ou `"cards": [ … ]` (questions au format des packs), `"revisions": 50`, `"streak": 7` (jours de flamme), `"boss": "<chapitre>"`. Sans type, c'est un simple message. Une récompense `surprise` apparaît en silhouette dès la première réussite, se remplit avec la progression et se dévoile à la fin. Le bon gagné va dans Trésors ; le parent le valide avec son code (« Échangé le … »). Le dépôt est public : le texte est lisible par tous.
- **Leçon « revanche »** (erreurs d'une interro) : une leçon avec `"remed": {"date": "2026-10-02", "title": "Interro nombres décimaux"}`. Ses cartes rapportent 3 fois plus d'XP, comptent double pour les défis « cartes difficiles » et passent en premier. Elle est reliée à la note de même matière et même date, saisie dans l'Espace parent. Les notes elles-mêmes ne sont jamais mises dans un pack (dépôt public).
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

## 6. Foyer (indépendant des révisions)

- **Préparation** : les parents choisissent missions, défis et prénoms dans Moi → Espace parent → Foyer (code parent). Rien de personnel n'est dans le code : la configuration reste sur le téléphone. Les changements s'appliquent à partir du jour même (historique par date). Une configuration peut aussi arriver par un lien `#fcfg~…` (même format compressé que le bilan), appliqué après le code parent.
- **Missions** : tâches de la maison par jour de la semaine, chacune avec son heure limite (heure de Paris, corrigée par l'heure du serveur quand le téléphone est en ligne). Avant l'heure : aucune alerte. Cochée avant : médaille d'or ; après : argent. Après l'heure, Ren rappelle la mission à l'ouverture et un point rouge s'affiche sur l'onglet. Semaine complète (lundi → dimanche) : un jeton, échangé avec le code parent. Un parent peut corriger les deux dernières semaines.
- **Voie du mois** : défis d'amélioration personnelle (+1 par jour, ou +3 une fois par semaine), niveaux Graine → Bronze → Argent → Or → Légende, à environ 26, 48, 70 et 87 % des points possibles du mois, remise à zéro le 1er du mois, record conservé. Hier peut encore être coché.
- **Jardin des bienfaits** : carnet sans points ; chaque bienfait fait éclore une fleur ; décors débloqués à 5, 10, 15, 20, 30 bienfaits ; les jardins des mois passés restent consultables. Illustrations facultatives : `IMAGES.garden` (bg, 8 fleurs, 5 décors) dans `data/images.js`.
- Aucun XP ni effet sur les clans ; les révisions ne rapportent rien ici.

## 7. Emploi du temps et agenda (saisis par l'élève)

- **Emploi du temps** (`S.edt`) : créneaux par jour (lundi → samedi), matière (clans de Hikari + EPS, arts, musique, techno, vie de classe, étude, autre), salle, semaine 1, 2 ou les deux. Alternance 1/2 à partir d'une semaine de référence, en sautant les semaines de vacances de la zone ; bouton de correction si le collège compte autrement. Icônes des matières modifiables.
- **Cartable** (Dōjō) : le matin, les cours du jour ; ensuite, les matières du prochain jour de cours, et les échéances des 7 prochains jours.
- **Agenda** (`S.agenda`) : contrôle, interro, leçon à apprendre, oral ; date (raccourci « prochain cours »), sujet, leçons Hikari liées. Pendant les 7 jours qui précèdent, jusqu'à 15 cartes de ces leçons passent en tête de la révision du jour (jamais vues d'abord, puis les plus fragiles), avec un badge. Une carte pas encore due et réussie garde son calendrier (pas de bachotage qui fausse les intervalles). Bouton « S'entraîner maintenant » par échéance.
- Les devoirs écrits restent dans l'agenda papier ; l'emploi du temps officiel reste sur École Directe.
- **Personnages de matière** : `IMAGES.subj.<matière>` dans `data/images.js` (clés `subj-fr`, `subj-ma`… via `tools/add-images.py`), ajoutés uniquement après validation du parent. Ils remplacent l'emoji dans l'emploi du temps, le cartable et l'agenda ; l'élève ne choisit un emoji que pour les matières sans personnage. Pas d'import d'image depuis le téléphone.
- **Jauge d'une échéance** : « vu » (cartes déjà travaillées) et « prête » (dernière réponse juste) sur les cartes des leçons liées ; l'apprenti annonce une fois « Prête » quand tout est réussi. Option « cartes du programme » (activée par défaut) : ajoute les leçons de base non issues du cours de la prof, du même chapitre ou des chapitres qui couvrent les mêmes points du programme.
- Pendant une préparation, les cartes de préparation prennent la place des nouvelles cartes du jour (les révisions dues restent).
- **Niveaux** : courbe `need(l) = 100 + 70 (l − 1)`, Légende (niv. 45) ≈ 70 000 XP, calibrée sur une année scolaire. Migration `curveV2` : le niveau atteint et la fraction en cours sont conservés.
- **Palmarès de la Voie** : instantané par mois terminé (`foyer.palm`), points et niveau atteint, record couronné.
- **Barème XP** : 2 XP pour une carte ratée (participation), 10 XP pour toute bonne réponse, +50 % si la carte avait déjà été ratée ; bonus d'enchaînement jusqu'à +50 % ; revanche ×3.
- **Séances avec un parent** (salle d'entraînement) : matière, durée (15 à 60 min), parent, sujet ; validées avec le code parent ; 10 XP par minute, +100 XP si une autre séance a eu lieu dans les 7 jours précédents ; historique et emblèmes (1, 10, 30 séances). Ne comptent pas pour la flamme.
- **Code parent à 6 chiffres** : un ancien code à 4 chiffres est accepté une dernière fois, puis l'appli impose d'en choisir un à 6.
