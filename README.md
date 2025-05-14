# Portfolio Anselme Garnier

Bienvenue sur le dépôt de mon portfolio interactif, conçu pour présenter mon univers, mes compétences et mes projets de façon originale, immersive et ludique. Ce projet est une vitrine technique et créative, inspirée par la série **Severance** et enrichie de nombreux clins d’œil, fonctionnalités cachées et expériences utilisateur uniques.

---

## 📚 Sommaire

- [À propos du projet](#à-propos-du-projet)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Easter Eggs & Références Severance](#easter-eggs--références-severance)
- [Technologies & Architecture](#technologies--architecture)
- [Installation & Lancement](#installation--lancement)
- [Personnalisation & Édition](#personnalisation--édition)
- [Contact & Contribution](#contact--contribution)

---

## 🧑‍💻 À propos du projet

Ce portfolio va bien au-delà d’un simple CV en ligne : il propose une expérience interactive, narrative et personnalisée, où chaque visiteur peut explorer mes réalisations, découvrir des surprises cachées et interagir avec des modules inspirés de l’univers de Severance (Lumon Industries).

L’objectif est de démontrer mes compétences en développement web moderne (HTML, CSS, JavaScript, Tailwind, DaisyUI, animations avancées), mon sens du détail UX/UI, et ma créativité à travers des fonctionnalités inattendues.

---

## ✨ Fonctionnalités principales

- **Interface responsive** : Adaptée à tous les écrans (mobile, tablette, desktop)
- **Thème dynamique** : Sombre/clair, transitions douces, respect des préférences système
- **Navigation immersive** : Menu animé, transitions fluides, effets de survol et feedback visuel
- **Section Projets** : Fiches détaillées, filtres dynamiques, liens directs vers les repos/démos
- **Timeline de parcours** : Visualisation animée de mon parcours pro et académique
- **Compétences interactives** : Badges, jauges animées, classement par expertise
- **Blog/Notes** : Articles techniques, retours d’expérience, astuces de dev, recherche instantanée
- **Contact** : Formulaire validé, notifications de succès/erreur, liens réseaux sociaux, QR code LinkedIn
- **Accessibilité** : Navigation clavier, contrastes adaptés, textes alternatifs

---

## 🥚 Easter Eggs & Références Severance

Le site regorge de surprises et de références à Severance, pour les fans et les curieux :

### 🧮 Calculatrice Lumon
- **Activation** : Taper `lumon` ou `calculator` sur n’importe quelle page
- **Fonctionnalités** : Calculatrice rétro, interface verte sur noir, sons typiques, bugs et messages cachés façon série

### 🔓 Terminal Bruteforce
- **Activation** : Taper `hack` ou `terminal`
- **Fonctionnalités** : Faux terminal, brute force visuel, défilement de codes, déblocage de "zones secrètes", messages cryptiques

### 🗂️ Mode Macro Data Refinement (MDR)
- **Activation** : Appuyer sur `M`, `D`, `R` simultanément
- **Fonctionnalités** : Interface transformée façon bureau Lumon, mini-jeu de tri de données, récompense humoristique à la fin



---

## 🛠️ Technologies & Architecture

- **HTML5 / CSS3** : Structure et styles de base
- **JavaScript Vanilla** : Interactivité, animations, easter eggs
- **Tailwind CSS** : Stylisation utilitaire, thèmes personnalisés
- **DaisyUI** : Composants UI élégants et accessibles
- **IntersectionObserver API** : Animations au défilement
- **Web Audio API** : Effets sonores pour les easter eggs
- **Font Awesome** : Icônes vectorielles

### Structure des dossiers

```
assets/           # Images, illustrations, logos
components/       # Fragments HTML réutilisables (header, footer, CV, etc.)
css/              # Fichiers CSS (styles, animations, thèmes, etc.)
js/               # Scripts JS (animations, easter eggs, jeux, etc.)
index.html        # Page principale du portfolio
severance.html    # Mini-jeu Severance (grid)
data-refinement-game.html # Mini-jeu Macro Data Refinement
severance-cv.html # CV spécial déblocable
README.md         # Ce fichier
package.json      # Dépendances et scripts (si build ou outils JS)
```

---

## 🚀 Installation & Lancement

### Prérequis

- Node.js >= 16.x (pour les outils de build éventuels)
- npm ou yarn (optionnel, si tu veux builder ou tester)

### Installation

```bash
git clone https://github.com/anselme-garnier/portfolio.git
cd portfolio
npm install
# ou
yarn install
```

### Démarrage en développement

```bash
npm run dev
# ou
yarn dev
```
Accède à [http://localhost:3000](http://localhost:3000)

### Build production

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

Ou ouvre simplement `index.html` dans ton navigateur pour une version statique.

---

## 🛠️ Personnalisation & Édition

- **Ajouter un projet** : Modifie `components/competences.html` ou ajoute une carte dans la section projets
- **Changer les couleurs/thèmes** : Modifie `css/theme-colors.css` ou les variables CSS dans les fichiers concernés
- **Ajouter un article** : Ajoute un fichier HTML ou Markdown dans un dossier dédié (ex : `/blog/`)
- **Modifier les easter eggs** : Vois les scripts dans `js/` (ex : `mac-animation.js`, `severance-data.js`)
- **Traduction** : Centralise les textes dans des fichiers ou variables JS si besoin

### Conseils

- Utilise VSCode avec les extensions recommandées (ESLint, Prettier, Tailwind CSS IntelliSense)
- Lance les tests avec `npm test` ou `yarn test` si tu ajoutes des scripts testables
- Déploie facilement sur Vercel, Netlify ou GitHub Pages

---



> Suggestions, issues ou PR bienvenues !  
> Merci d’avoir exploré mon univers, et amusez-vous à trouver tous les secrets Lumon…  
> _"Qu’est-ce que vous faites ici, vraiment ?"_ 🕵️‍♂️

---

© 2025 Anselme Garnier. Tous droits réservés.