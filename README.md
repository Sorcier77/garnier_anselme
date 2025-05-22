# Portfolio Anselme Garnier

Bienvenue sur le dépôt de mon portfolio interactif, conçu pour présenter mon univers, mes compétences et mes projets de façon originale, immersive et ludique. Ce projet est une vitrine technique et créative, inspirée par la série **Severance** et enrichie de nombreux clins d'œil, fonctionnalités cachées et expériences utilisateur uniques. **Testez de taper `M`, `D`, `R` sur la page.**


![aperçu](<aperçu.png>)

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

Ce portfolio va bien au-delà d'un simple CV en ligne : il propose une expérience interactive, narrative et personnalisée, où chaque visiteur peut explorer mes réalisations, découvrir des surprises cachées et interagir avec des modules inspirés de l'univers de Severance (Lumon Industries).

L'objectif est de démontrer mes compétences en développement web moderne, particulièrement avec **Tailwind CSS** et **DaisyUI** qui sont utilisés massivement dans ce projet, tout en conservant des fichiers CSS personnalisés pour des besoins spécifiques. Le tout avec un focus sur l'UX/UI et la créativité.

J'ai essayé de fractionner les composant du index.html mais j'ai abandonné. Si vous voulez essayer les components sont déjà diviser dans le dossier components. Il faudrait utiliser un framework pour associer les components. 

---

## ✨ Fonctionnalités principales

- **Interface responsive** : Adaptée à tous les écrans grâce à Tailwind CSS
- **Thème dynamique** : Sombre/clair avec DaisyUI, transitions douces
- **Navigation immersive** : Menu animé, transitions fluides, effets de survol et feedback visuel et d'effets au scroll.
- **Compétences interactives** : Badges Tailwind/DaisyUI, jauges animées, classement par expertise
- **Contact** : Formulaire validé avec composants DaisyUI, notifications, cette partie est verouillée par un questionnaire à bien remplir (sinon un bouton bruteforce est mis en place pour y accéder)
- **design reproduit dans le style d'Apple** : le but a été de reproduire le fameux mac 1989. 
- **Easter Egg severance** : En tapant `MDR` vous avez accès à une partie secrète du site en lien avec la série Severance. 
- **Reproduction simple d'un jeu de tri de macrodonnées** : j'ai reproduit une base de jeux comme dans la série, vous le trouverez en tapant `MDR` dans le site.
- **templates créées dans le fichier `severance-effects.html`**

---

## 🥚 Easter Eggs & Références Severance

Le site regorge de surprises et de références à Severance, pour les fans et les curieux :

### CV à la Severance pour le profil de l'employé

- **Une page de CV stylisé**


### 🗂️ Mode Macro Data Refinement (MDR)
- **Activation** : Appuyer sur `M`, `D`, `R`
- **Fonctionnalités** : Interface transformée utilisant des composants DaisyUI et Tailwind CSS

---

## 🛠️ Technologies & Architecture

- **HTML5** : Structure sémantique
- **Tailwind CSS** : Utilisé comme framework CSS principal pour la stylisation modulaire et responsive
- **DaisyUI** : Système de composants basé sur Tailwind pour les éléments d'interface utilisateur
- **CSS personnalisé** : Fichiers CSS spécifiques pour des animations complexes et styles avancés
- **JavaScript Vanilla** : Interactivité, animations, easter eggs
- **IntersectionObserver API** : Animations au défilement
- **Web Audio API** : Effets sonores pour les easter eggs

### Structure des dossiers

```
assets/           # Images, illustrations, logos
components/       # Fragments HTML réutilisables (header, footer, CV, etc.)
css/              # Fichiers CSS personnalisés (animations, effets spéciaux, etc.)
tailwind/         # Configuration Tailwind et fichiers associés
js/               # Scripts JS (animations, easter eggs, jeux, etc.)
pages/            # Pages secondaires du site
index.html        # Page principale du portfolio
severance.html    # Mini-jeu Severance (grid)
data-refinement-game.html # Mini-jeu Macro Data Refinement
severance-cv.html # CV spécial déblocable
README.md         # Ce fichier
package.json      # Dépendances incluant Tailwind CSS et DaisyUI
```

---

## Utilisation de DaisyUI et Tailwind


## Classes Tailwind CSS dans le projet

### Mise en page responsive

Le système de grille Tailwind est utilisé pour créer des layouts flexibles qui s'adaptent à différentes tailles d'écran :

```html
<div class="cv-main grid grid-cols-1 lg:grid-cols-3 gap-8">
```

Ce code crée une disposition en une seule colonne sur mobile, et trois colonnes sur les grands écrans.

### Espacement et marges

Les utilités de padding (`p-`, `px-`, `py-`) et margin (`m-`, `mx-`, `my-`) sont largement utilisées :

```html
<div class="card-body p-8">
    <h3 class="text-2xl font-semibold mb-4">Design & UI/UX</h3>
    <div class="h-1 w-20 bg-blue-500 rounded-full mb-6"></div>
```

### Flexbox et alignement

Les classes flex de Tailwind facilitent l'alignement des éléments :

```html
<div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
```

Cette ligne change l'orientation des éléments de colonne à ligne selon la taille de l'écran.

### Couleurs et personnalisation

Tailwind permet l'utilisation facile de couleurs prédéfinies :

```html
<div class="progress-value" style="width: 90%; background: linear-gradient(90deg, #9333ea, #c084fc);"></div>
```

## Composants DaisyUI

DaisyUI ajoute une couche de composants prêts à l'emploi par-dessus Tailwind CSS. Voici quelques exemples d'utilisation dans le portfolio :

### Navbar

```html
<div class="navbar bg-white shadow-sm fixed top-0 w-full z-50">
```

La classe `navbar` est un composant DaisyUI qui crée une barre de navigation stylisée.

### Boutons

```html
<button id="toggleCalculator" class="btn btn-ghost btn-circle hidden md:flex">
```

Les classes `btn`, `btn-ghost` et `btn-circle` sont des styles de boutons DaisyUI.

### Cards

```html
<div class="card bg-white shadow-xl max-w-2xl mx-auto apple-card scale-in">
    <div class="card-body p-8">
```

Les classes `card` et `card-body` sont des composants DaisyUI pour créer des cartes stylisées.

### Alerts

```html
<div id="result-message" class="alert hidden">
    <!-- Message de résultat ici -->
</div>
```

La classe `alert` de DaisyUI crée des messages d'alerte stylisés.

## Combinaison avec CSS personnalisé

J'ai combiné les classes utilitaires de Tailwind avec du CSS personnalisé pour des fonctionnalités plus complexes :

```css
.apple-card {
    border-radius: 16px;
    background: #fafafa;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
```

Ce CSS personnalisé est ensuite appliqué avec la classe `.apple-card` dans vos éléments HTML.

## Exemples de fonctionnalités avancées

### Thématisation

DaisyUI permet de facilement changer de thème en ajoutant un attribut `data-theme` à l'élément HTML :

```html
<html lang="fr" data-theme="light">
```

### Animation et interaction

Combinaison de Tailwind et CSS personnalisé pour créer des animations riches :

```html
<div class="apple-card scale-in" style="animation-delay: 0.1s; background: white;">
```

### Barres de progression

Utilisation des styles Tailwind pour créer des indicateurs visuels de compétence :

```html
<div class="progress-bar">
    <div class="progress-value" style="width: 92%"></div>
</div>
```

## Bonnes pratiques 

1. **Mobile-first design** : Utilisation cohérente de préfixes responsive (`md:`, `lg:`)

2. **Composants modulaires** : Structure du projet avec des composants réutilisables dans le dossier components

3. **Personnalisation avancée** : Extension des fonctionnalités de base de Tailwind et DaisyUI avec du CSS ciblé pour des besoins spécifiques

4. **Architecture CSS organisée** : Séparation en fichiers CSS thématiques (layout.css, components.css, animations.css)

5. **Performance** : Utilisation judicieuse des classes utilitaires directement dans le HTML pour minimiser le CSS global

Ce mélange de Tailwind, DaisyUI et CSS personnalisé permet d'obtenir une interface moderne, responsive et hautement personnalisée, tout en maintenant un code propre et bien structuré.

## 🚀 Installation & Lancement

### Prérequis

- Node.js >= 16.x (pour Tailwind CSS et DaisyUI)
- npm ou yarn

### Installation

```bash
git clone https://github.com/anselme-garnier/portfolio.git
cd portfolio
npm install
# ou
yarn install
```
### Démarrage

```bash
npm run start
````

Accède à [http://localhost:3000](http://127.0.0.1:3000)


### Démarrage en développement

```bash
npm run dev
# ou
yarn dev
```
Accède à [http://localhost:3000](http://127.0.0.1:3000)

### Build production

```bash
npm run build
# ou
yarn build
```

Le build génère les fichiers CSS optimisés de Tailwind pour la production.

---

## 🛠️ Personnalisation & Édition

- **Ajouter un projet** : Modifie les composants dans le dossier `components/`
- **Changer les thèmes** : Modifie la configuration dans `tailwind.config.js` ou les variables DaisyUI
- **Styles spécifiques** : Utilise les fichiers dans `css/` pour les besoins particuliers
- **Modifier les easter eggs** : Vois les scripts dans `js/`

### Conseils

- Utilise VSCode avec les extensions Tailwind CSS IntelliSense pour une meilleure expérience


---

> Suggestions, issues ou PR bienvenues !  
> Merci d'avoir exploré mon univers, et amusez-vous à trouver tous les secrets Lumon…  
> _"Qu'est-ce que vous faites ici, vraiment ?"_ 🕵️‍♂️

---

© 2025 Sorcier77. Tous droits réservés.