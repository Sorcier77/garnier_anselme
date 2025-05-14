/**
 * Animation du Mac vintage et gestion des easter eggs
 */

// Variables et fonctions générales pour l'animation du Mac
let animationComplete = false;
let lastScrollTop = 0;
let ticking = false;
let animationState = 'start';
let macContainer = null;

// Texte à afficher dans le Mac
const lines = [
    "> INITIALISATION SYSTÈME LUMON\n",
    "> AUTORISATION MDR: NIVEAU 3\n",
    "> ACCÈS ACCORDÉ: PROFIL #8722\n",
    "\n",
    "CHARGEMENT DONNÉES MACRODATA...\n",
    "\n",
    "------------------------\n",
    "SUJET: GARNIER, ANSELME\n",
    "------------------------\n",
    "DIVISION: DÉVELOPPEMENT [MDR]\n",
    "STATUT: RAFFINEMENT EN COURS\n",
    "\n",
    "APTITUDES QUANTIFIÉES:\n",
    "FRONT-END: 87%\n",
    "BACK-END: 82%\n",
    "SYSTÈMES: 75%\n",
    "\n",
    "> CONNEXIONS ÉTABLIES\n",
    "> DÉFILEMENT POUR CONTINUER\n",
];

// Phrases d'easter egg Lumon


// Fonction pour jouer un son d'ambiance
function playOSSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'error':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(240, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(180, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
            case 'unlock':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(520, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(780, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
        }
    } catch (err) {
        console.log('Sound play error:', err);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Réinitialiser la position de défilement au chargement de la page
    window.scrollTo(0, 0);
    
    // Initialiser les référence aux éléments du DOM
    macContainer = document.getElementById('mac-container');
    if (!macContainer) return; // Sortir si l'élément Mac n'existe pas
    
    const scrollInstruction = document.getElementById('scroll-instruction');
    const cvContent = document.getElementById('cv-content');
    const macText = document.getElementById('mac-typing-text');
    const screenScroll = document.getElementById('screen-scroll');
    const calculatrice = document.querySelector('.calculatrice-secrete');
    
    let lineIndex = 0;
    let charIndex = 0;
    
    // Animation de la machine à écrire
    function typeWriter() {
        if (lineIndex < lines.length) {
            if (charIndex < lines[lineIndex].length) {
                macText.textContent += lines[lineIndex].charAt(charIndex);
                charIndex++;
                
                // Auto-scroll vers le bas pendant l'écriture
                screenScroll.scrollTop = screenScroll.scrollHeight;
                
                setTimeout(typeWriter, Math.random() * 30 + 20); // Vitesse variable pour effet réaliste
            } else {
                lineIndex++;
                charIndex = 0;
                setTimeout(typeWriter, 200); // Pause entre lignes
            }
        } else {
            // Animation de frappe terminée
            setTimeout(() => {
                animationComplete = true;
                if (scrollInstruction) scrollInstruction.style.opacity = "1";
                
                // Effet visuel pour indiquer que l'animation est terminée
                macContainer.classList.add('attention-pulse');
                setTimeout(() => {
                    macContainer.classList.remove('attention-pulse');
                }, 1500);
            }, 500);
        }
    }
    
    // Positionnement initial et effet style Apple pour le Mac
    macContainer.classList.remove('mac-fixed');
    macContainer.style.transformStyle = 'preserve-3d';
    macContainer.style.position = 'fixed';
    macContainer.style.left = '50%';
    macContainer.style.top = '50%';
    macContainer.style.transform = 'translate(-50%, -50%) scale(0.95) translateZ(0)';
    macContainer.style.zIndex = '40';
    macContainer.style.opacity = '0';
    macContainer.style.transition = 'all 1s cubic-bezier(0.215, 0.610, 0.355, 1.000)';
    
    // Déclencher l'apparition initiale après un court délai
    setTimeout(() => {
        macContainer.style.opacity = '1';
        macContainer.style.transform = 'translate(-50%, -50%) scale(1) translateZ(50px)';
    }, 500);
    
    window.addEventListener('scroll', function() {
        lastScrollTop = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll(lastScrollTop);
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function handleScroll(scrollPos) {
        const windowHeight = window.innerHeight;
        
        // Phase 1: Mac immobile et zoom avant pour donner l'impression d'y entrer
        if (scrollPos < windowHeight * 0.3) {
            if (animationState !== 'visible' && animationState !== 'move-in') {
                animationState = 'move-in';
                macContainer.style.transform = 'translate(-50%, -50%) scale(1.05) translateZ(100px)';
                macContainer.style.opacity = '1';
                
                // Cacher la calculatrice pendant cette phase
                if (calculatrice) calculatrice.classList.remove('visible');
                
                setTimeout(() => {
                    animationState = 'visible';
                }, 600);
            }
            // Ajuster l'opacité de l'instruction de défilement
            if (scrollInstruction) {
                scrollInstruction.style.opacity = Math.max(0, 1 - (scrollPos / (windowHeight * 0.2)));
            }
        }
        // Phase 2: Animation de transition - impression d'être à l'intérieur
        else if (scrollPos < windowHeight * 0.7) {
            const progress = (scrollPos - windowHeight * 0.3) / (windowHeight * 0.4);
            
            // Effet de zoom progressif pour donner l'impression d'entrer dans l'écran
            const zoomScale = 1.05 + progress * 0.3;
            const zDepth = 100 + progress * 150;
            
            macContainer.style.transform = `translate(-50%, -50%) scale(${zoomScale}) translateZ(${zDepth}px)`;
            
            // Progressivement disparaître les bords du Mac
            if (progress > 0.5) {
                macContainer.style.opacity = Math.max(0, 2 - progress * 2);
            } else {
                macContainer.style.opacity = '1';
            }
            
            // Cacher la calculatrice pendant cette phase
            if (calculatrice) calculatrice.classList.remove('visible');
            
            animationState = 'transition';
        }
        // Phase 3: Animation de sortie du Mac
        else if (scrollPos < windowHeight) {
            if (animationState !== 'move-out' && animationState !== 'hidden') {
                animationState = 'move-out';
                
                // Animation effet Apple - sortie
                macContainer.style.transform = 'translate(-50%, -50%) translateZ(-100px) rotateX(10deg) scale(0.7)';
                macContainer.style.opacity = '0';
                
                setTimeout(() => {
                    animationState = 'hidden';
                    
                    // Ne plus afficher la calculatrice automatiquement
                    // if (calculatrice) calculatrice.classList.add('visible');
                }, 600);
            }
            if (scrollInstruction) scrollInstruction.style.opacity = 0;
        }
        // Phase 4: Mac complètement masqué
        else {
            if (animationState !== 'hidden') {
                animationState = 'hidden';
                macContainer.style.transform = 'translate(-50%, -50%) translateZ(-200px) rotateX(20deg) scale(0.5)';
                macContainer.style.opacity = '0';
                
                // Ne plus afficher la calculatrice automatiquement
                // if (calculatrice) calculatrice.classList.add('visible');
            }
        }
        
        // Effet de parallaxe pour le contenu principal
        if (cvContent) {
            if (scrollPos > windowHeight * 0.5) {
                const parallaxOffset = Math.min(1, (scrollPos - windowHeight * 0.5) / windowHeight);
                cvContent.style.transform = `translateY(${-50 + parallaxOffset * 50}px)`;
                cvContent.style.opacity = parallaxOffset;
            } else {
                cvContent.style.transform = 'translateY(0)';
                cvContent.style.opacity = '0';
            }
        }
    }
    
    // Démarrer l'animation de la machine à écrire après un délai
    setTimeout(typeWriter, 800);
    
    // Clic sur l'écran fait défiler vers la section suivante
    const macScreen = document.querySelector('.mac-screen');
    if (macScreen) {
        macScreen.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight * 0.5,
                behavior: 'smooth'
            });
        });
    }
});

// Konami code avec détection plus fiable
let konamiCodeSequence = [];
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiTimeout;

window.addEventListener('keydown', function(e) {
    // Réinitialiser le timeout à chaque frappe
    clearTimeout(konamiTimeout);
    
    // Ajouter la touche à la séquence
    konamiCodeSequence.push(e.key);
    
    // Vérifier si la séquence correspond au début du code Konami
    let isValid = true;
    for (let i = 0; i < konamiCodeSequence.length && i < konamiCode.length; i++) {
        if (konamiCodeSequence[i] !== konamiCode[i]) {
            isValid = false;
            break;
        }
    }
    
    // Si la séquence n'est plus valide ou trop longue, réinitialiser
    if (!isValid || konamiCodeSequence.length > konamiCode.length) {
        konamiCodeSequence = [];
        if (e.key === konamiCode[0]) {
            konamiCodeSequence.push(e.key);
        }
    }
    
    // Délai de réinitialisation de 2 secondes si l'utilisateur arrête de taper
    konamiTimeout = setTimeout(() => {
        konamiCodeSequence = [];
    }, 2000);
    
    // Vérifier si le Konami Code complet a été saisi
    if (konamiCodeSequence.length === konamiCode.length && isValid) {
        console.log("Konami code activé!");
        
        // Effet visuel pour indiquer que le code a été reconnu
        document.body.classList.add('konami-activated');
        
        // Son de déverrouillage
        playOSSound('unlock');
        
        // Réinitialiser la séquence
        konamiCodeSequence = [];
        clearTimeout(konamiTimeout);
        
        // Animation spéciale avant le lancement du jeu
        const macScreen = document.querySelector('.mac-screen');
        if (macScreen) {
            macScreen.classList.add('konami-glitch');
            
            // Afficher un message spécial Lumon
            const konamiMsg = document.createElement('div');
            konamiMsg.className = 'konami-message';
            konamiMsg.innerHTML = '<span class="blink">ACCÈS RESTREINT AUTORISÉ</span><br>MACRO DATA REFINEMENT<br>INITIALISATION...';
            macScreen.appendChild(konamiMsg);
            
            setTimeout(() => {
                // Lancer le jeu de raffinement des données
                launchSeveranceDataGame();
                
                // Nettoyer les effets après un délai
                setTimeout(() => {
                    macScreen.classList.remove('konami-glitch');
                    konamiMsg.remove();
                    document.body.classList.remove('konami-activated');
                }, 3000);
            }, 1500);
        }
    }
});

// Fonction pour lancer le jeu de raffinement de données
function launchSeveranceDataGame() {
    console.log("Tentative de lancement du jeu de raffinement de données");
    
    // Si le script est déjà chargé, utiliser la fonction directement
    if (typeof window.launchDataRefinementGame === 'function') {
        console.log("Fonction de raffinement déjà disponible, lancement direct");
        window.launchDataRefinementGame();
        return;
    }
    
    console.log("Chargement dynamique du script de raffinement");
    
    // Charger le script dynamiquement
    const severanceScript = document.createElement('script');
    severanceScript.src = 'js/severance-data.js';
    
    // Gestion des événements de chargement
    severanceScript.onload = function() {
        console.log("Script de raffinement chargé avec succès");
        
        // Vérifier que la fonction est disponible après chargement
        if (typeof window.launchDataRefinementGame === 'function') {
            console.log("Démarrage du jeu de raffinement");
            setTimeout(window.launchDataRefinementGame, 500);
        } else {
            console.error("La fonction launchDataRefinementGame n'est pas disponible après chargement");
            fallbackToSeverancePage();
        }
    };
    
    // Gestion des erreurs de chargement
    severanceScript.onerror = function() {
        console.error("Erreur lors du chargement du script severance-data.js");
        fallbackToSeverancePage();
    };
    
    // Fonction de repli en cas d'erreur
    function fallbackToSeverancePage() {
        // Afficher un message d'erreur
        const errorMessage = document.createElement('div');
        errorMessage.style.position = 'fixed';
        errorMessage.style.top = '50%';
        errorMessage.style.left = '50%';
        errorMessage.style.transform = 'translate(-50%, -50%)';
        errorMessage.style.background = 'rgba(0,0,0,0.8)';
        errorMessage.style.color = '#aef6ff';
        errorMessage.style.padding = '20px';
        errorMessage.style.borderRadius = '5px';
        errorMessage.style.fontFamily = "'VT323', monospace";
        errorMessage.style.zIndex = '10000';
        errorMessage.innerHTML = `
            <div style="text-align:center">
                <p>ERREUR DE SYSTÈME MDR</p>
                <p>REDIRECTION VERS PAGE ALTERNATIVE...</p>
            </div>
        `;
        document.body.appendChild(errorMessage);
        
        // Rediriger l'utilisateur après un court délai
        localStorage.setItem('severanceGameCompleted', 'true');
        setTimeout(() => {
            window.location.href = 'severance-cv.html';
        }, 2000);
    }
    
    // Ajouter le script au document
    document.head.appendChild(severanceScript);
}

// Easter egg: Séquence de touches MDR (M+D+R)
let mdrSequence = '';
const mdrCode = 'mdr';
const lumonEasterEggs = [
    "LES NOMBRES RACONTENT DES SECRETS",
    "TRIEZ POUR ÊTRE LIBÉRÉ",
    "FAITES CONFIANCE AU PROCESSUS",
    "RAFFINEMENT = LIBERTÉ",
    "NOUS AVONS BESOIN DE VOUS"
];

window.addEventListener('keydown', function(e) {
    // Ajouter la touche à la séquence et convertir en minuscules
    const key = e.key.toLowerCase();
    mdrSequence += key;
    
    // Conserver uniquement les 3 derniers caractères
    if (mdrSequence.length > mdrCode.length) {
        mdrSequence = mdrSequence.substring(mdrSequence.length - mdrCode.length);
    }
    
    // Vérifier si la séquence correspond à "mdr"
    if (mdrSequence === mdrCode) {
        console.log("Easter egg MDR activé!");
        
        // Activer un glitch temporaire
        document.body.classList.add('glitch-effect');
        
        // Son d'erreur système style Apple
        playOSSound('error');
        
        // Afficher un message subliminal fort et centré
        const randomIndex = Math.floor(Math.random() * lumonEasterEggs.length);
        const subliminalMsg = document.createElement('div');
        subliminalMsg.className = 'subliminal-message big-message';
        subliminalMsg.textContent = lumonEasterEggs[randomIndex];
        document.body.appendChild(subliminalMsg);
        
        // Activer le mode Severance et lancer le jeu après animation
        setTimeout(() => {
            document.body.classList.remove('glitch-effect');
            if (subliminalMsg.parentNode) {
                subliminalMsg.parentNode.removeChild(subliminalMsg);
            }
            
            // Ajouter une animation de fin avant le jeu
            const severanceTransition = document.createElement('div');
            severanceTransition.className = 'severance-transition';
            severanceTransition.style.position = 'fixed';
            severanceTransition.style.inset = '0';
            severanceTransition.style.backgroundColor = 'rgba(0,0,0,0.9)';
            severanceTransition.style.display = 'flex';
            severanceTransition.style.justifyContent = 'center';
            severanceTransition.style.alignItems = 'center';
            severanceTransition.style.zIndex = '9999';
            severanceTransition.style.fontFamily = "'IBM Plex Mono', monospace";
            severanceTransition.style.color = '#aef6ff';
            severanceTransition.innerHTML = `
                <div class="severance-message" style="text-align:center;">
                    <p style="font-size:1.8rem; margin-bottom:1rem;">ACCÈS SEVERANCE ACCORDÉ</p>
                    <p style="font-size:1.3rem; animation: blink 1s infinite;">INITIALISATION DU RAFFINEMENT DE DONNÉES...</p>
                </div>
            `;
            document.body.appendChild(severanceTransition);
            
            // Ajouter l'animation de blink si elle n'existe pas
            if (!document.querySelector('style#blink-animation')) {
                const style = document.createElement('style');
                style.id = 'blink-animation';
                style.textContent = `
                    @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Réinitialiser la séquence
            mdrSequence = '';
            
            // Rediriger vers la page de jeu dédiée
            setTimeout(() => {
                window.location.href = 'data-refinement-game.html';
            }, 2000);
        }, 1500);
    }
});

// Version améliorée du jeu Severance avec grille comme dans le film
function launchSeveranceGridGame() {
    console.log("Lancement du jeu Severance avec grille de raffinement");
    
    // Créer l'interface du jeu
    const gameContainer = document.createElement('div');
    gameContainer.id = 'severance-game';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '0';
    gameContainer.style.left = '0';
    gameContainer.style.width = '100%';
    gameContainer.style.height = '100%';
    gameContainer.style.backgroundColor = '#0a1620';
    gameContainer.style.color = '#aef6ff';
    gameContainer.style.fontFamily = "'VT323', monospace";
    gameContainer.style.zIndex = '9999';
    gameContainer.style.display = 'flex';
    gameContainer.style.flexDirection = 'column';
    gameContainer.style.padding = '0';
    gameContainer.style.overflow = 'hidden'; // Évite le débordement
    
    // Contenu du jeu
    gameContainer.innerHTML = `
        <div style="padding: 1rem; border-bottom: 1px solid #aef6ff; display: flex; justify-content: space-between; align-items: center; background-color: rgba(0,0,0,0.3);">
            <div style="display: flex; align-items: center;">
                <svg width="30" height="30" viewBox="0 0 100 100" fill="none" style="margin-right: 10px;">
                    <circle cx="50" cy="50" r="45" stroke="#aef6ff" stroke-width="3" />
                    <path d="M30,50 L70,50" stroke="#aef6ff" stroke-width="3" />
                    <path d="M50,30 L50,70" stroke="#aef6ff" stroke-width="3" />
                </svg>
                <h2 style="margin: 0; font-size: 1.3rem;">MACRO DATA REFINEMENT</h2>
            </div>
            <div>
                <span id="completion-percent">0%</span>
                <div style="width: 100px; height: 10px; background: rgba(0,0,0,0.3); border: 1px solid #aef6ff; margin-left: 10px; display: inline-block;">
                    <div id="progress-bar" style="height: 100%; width: 0%; background: #56cbdb; transition: width 0.5s ease;"></div>
                </div>
            </div>
        </div>

        <div style="flex-grow: 1; display: flex; flex-direction: column; padding: 1rem; position: relative;">
            <!-- Scanlines effect -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; background: linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%); background-size: 100% 4px; z-index: 10; opacity: 0.3;"></div>
            
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">DÉPARTEMENT DE RAFFINEMENT MACRO-DONNÉES</p>
                <p style="opacity: 0.7; font-size: 0.85rem;">Identifiez les nombres qui évoquent des émotions spécifiques</p>
            </div>
            
            <!-- Grille de nombres à la Severance -->
            <div class="refinement-game" style="display: flex; flex-direction: column; align-items: center; flex-grow: 1;">
                <!-- La grille de nombres -->
                <div id="number-grid" style="display: grid; grid-template-columns: repeat(5, minmax(60px, 1fr)); grid-template-rows: repeat(5, minmax(60px, 1fr)); gap: 12px; margin-bottom: 20px;">
                    <!-- Les nombres seront générés ici dynamiquement -->
                </div>
                
                <!-- Les bins (comme dans le film) -->
                <div style="display: flex; width: 100%; max-width: 800px; justify-content: space-between; margin-top: 30px;">
                    <div class="data-bin" data-category="effrayant" style="flex: 1; text-align: center; padding: 10px; border: 2px solid #ecc94b; margin: 0 10px; cursor: pointer; max-width: 22%;">
                        <div style="font-size: 1rem; color: #ecc94b; margin-bottom: 5px;">EFFRAYANT</div>
                        <div style="font-size: 1.7rem; color: #ecc94b;" id="bin-effrayant-count">0</div>
                    </div>
                    <div class="data-bin" data-category="triste" style="flex: 1; text-align: center; padding: 10px; border: 2px solid #3182ce; margin: 0 10px; cursor: pointer; max-width: 22%;">
                        <div style="font-size: 1rem; color: #3182ce; margin-bottom: 5px;">TRISTE</div>
                        <div style="font-size: 1.7rem; color: #3182ce;" id="bin-triste-count">0</div>
                    </div>
                    <div class="data-bin" data-category="joyeux" style="flex: 1; text-align: center; padding: 10px; border: 2px solid #48bb78; margin: 0 10px; cursor: pointer; max-width: 22%;">
                        <div style="font-size: 1rem; color: #48bb78; margin-bottom: 5px;">JOYEUX</div>
                        <div style="font-size: 1.7rem; color: #48bb78;" id="bin-joyeux-count">0</div>
                    </div>
                    <div class="data-bin" data-category="malveillant" style="flex: 1; text-align: center; padding: 10px; border: 2px solid #e53e3e; margin: 0 10px; cursor: pointer; max-width: 22%;">
                        <div style="font-size: 1rem; color: #e53e3e; margin-bottom: 5px;">MALVEILLANT</div>
                        <div style="font-size: 1.7rem; color: #e53e3e;" id="bin-malveillant-count">0</div>
                    </div>
                </div>
            </div>
            
            <!-- Message d'instruction -->
            <div style="text-align: center; margin-top: 20px; opacity: 0.8;">
                <p style="font-size: 0.9rem;">Sélectionnez un nombre puis cliquez sur la catégorie correspondante</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(gameContainer);
    document.body.style.overflow = 'hidden';  // Empêcher le scroll pendant le jeu
    
    // Ajout du style pour les sélections et animations
    const style = document.createElement('style');
    style.innerHTML = `
        .number-cell {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            min-height: 60px;
            font-size: 1.5rem;
            background-color: rgba(0, 0, 0, 0.3);
            border: 1px solid #aef6ff;
            color: #aef6ff;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
        }
        
        .number-cell:hover {
            background-color: rgba(174, 246, 255, 0.1);
        }
        
        .number-cell.selected {
            box-shadow: 0 0 15px #aef6ff, inset 0 0 5px #aef6ff;
            background-color: rgba(174, 246, 255, 0.2);
            transform: scale(1.05);
        }
        
        .data-bin {
            transition: all 0.3s ease;
        }
        
        .data-bin:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px currentColor;
        }
        
        .number-cell-flash {
            animation: flashCell 0.5s;
        }
        
        @keyframes flashCell {
            0% { background-color: rgba(174, 246, 255, 0.8); color: #0a1620; }
            100% { background-color: rgba(0, 0, 0, 0.3); color: #aef6ff; }
        }
        
        .blink {
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 49% { opacity: 0.7; }
            50%, 100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Initialiser le jeu
    initializeGridGame();
    
    // Fonction pour initialiser le jeu
    function initializeGridGame() {
        const numberGrid = document.getElementById('number-grid');
        if (!numberGrid) return;
        
        // Créer des nombres spécifiques comme dans la série
        const gridSize = 5; // Grille 5x5
        let selectedCell = null;
        let completedCount = 0;
        const totalNumbers = 25; // Total des nombres à trier
        
        // Générer des nombres pour la grille
        for (let i = 0; i < gridSize * gridSize; i++) {
            // Générer un nombre aléatoire entre 1 et 99
            const number = Math.floor(Math.random() * 99) + 1;
            
            // Créer la cellule pour le nombre
            const cell = document.createElement('div');
            cell.className = 'number-cell';
            cell.textContent = number;
            
            // Assigner aléatoirement une catégorie (celle-ci sera cachée pour le joueur)
            const categories = ['effrayant', 'triste', 'joyeux', 'malveillant'];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            cell.dataset.category = randomCategory;
            
            // Gérer la sélection de la cellule
            cell.addEventListener('click', function() {
                // Désélectionner la cellule précédente si elle existe
                if (selectedCell) {
                    selectedCell.classList.remove('selected');
                }
                
                // Sélectionner cette cellule
                this.classList.add('selected');
                selectedCell = this;
                
                // Faire pulser légèrement la cellule
                this.classList.add('number-cell-flash');
                setTimeout(() => {
                    this.classList.remove('number-cell-flash');
                }, 500);
                
                // Jouer un son de sélection
                playSelectionSound();
            });
            
            // Ajouter la cellule à la grille
            numberGrid.appendChild(cell);
        }
        
        // Configurer les bins pour le tri
        const dataBins = document.querySelectorAll('.data-bin');
        const binCounts = {
            'effrayant': 0,
            'triste': 0,
            'joyeux': 0,
            'malveillant': 0
        };
        
        dataBins.forEach(bin => {
            bin.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                if (!selectedCell) {
                    return; // Aucune cellule sélectionnée
                }
                
                // Déplacer la cellule (visuellement, elle disparaît)
                selectedCell.style.opacity = '0';
                selectedCell.style.transform = 'scale(0.8)';
                
                // Incrémenter le compteur de cette catégorie
                binCounts[category]++;
                document.getElementById(`bin-${category}-count`).textContent = binCounts[category];
                
                // Empêcher la réutilisation de cette cellule
                selectedCell.style.pointerEvents = 'none';
                
                // Désélectionner
                selectedCell.classList.remove('selected');
                
                // Jouer un son de tri/placement
                playRefinementSound();
                
                // Incrementer le compteur global
                completedCount++;
                updateProgress(completedCount, totalNumbers);
                
                // Vérifier si le jeu est terminé
                if (completedCount >= totalNumbers) {
                    setTimeout(() => {
                        showCompletionScreen();
                    }, 1000);
                } else {
                    // Remplacer ce nombre par un nouveau après un court délai
                    setTimeout(() => {
                        replaceGridCell(selectedCell);
                    }, 500);
                }
                
                selectedCell = null;
            });
        });
    }
    
    // Fonction pour remplacer une cellule de la grille
    function replaceGridCell(cell) {
        // Générer un nouveau nombre
        const number = Math.floor(Math.random() * 99) + 1;
        
        // Assigner aléatoirement une catégorie
        const categories = ['effrayant', 'triste', 'joyeux', 'malveillant'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        // Mettre à jour la cellule
        cell.dataset.category = randomCategory;
        cell.textContent = number;
        cell.style.opacity = '1';
        cell.style.transform = 'scale(1)';
        cell.style.pointerEvents = 'auto';
    }
    
    // Mettre à jour la barre de progression
    function updateProgress(count, total) {
        const progressBar = document.getElementById('progress-bar');
        const completionPercent = document.getElementById('completion-percent');
        
        const percent = Math.min(100, Math.round((count / total) * 100));
        progressBar.style.width = `${percent}%`;
        completionPercent.textContent = `${percent}%`;
    }
    
    // Fonction pour jouer un son de placement
    function playRefinementSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            const freq = 300 + Math.random() * 300;
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (err) {
            console.log('Sound play error:', err);
        }
    }
    
    // Fonction pour jouer un son de sélection
    function playSelectionSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (err) {
            console.log('Sound play error:', err);
        }
    }
    
    // Fonction pour afficher l'écran de fin
    function showCompletionScreen() {
        // Créer l'écran de complétion
        const completionScreen = document.createElement('div');
        completionScreen.style.position = 'fixed';
        completionScreen.style.top = '0';
        completionScreen.style.left = '0';
        completionScreen.style.width = '100%';
        completionScreen.style.height = '100%';
        completionScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        completionScreen.style.display = 'flex';
        completionScreen.style.justifyContent = 'center';
        completionScreen.style.alignItems = 'center';
        completionScreen.style.zIndex = '10000';
        
        completionScreen.innerHTML = `
            <div style="text-align: center; max-width: 500px; padding: 2rem; background-color: #0a1e3b; border: 1px solid #aef6ff; box-shadow: 0 0 20px rgba(174, 246, 255, 0.3);">
                <h2 style="font-size: 2.2rem; margin-bottom: 1.5rem; color: #aef6ff;">RAFFINEMENT TERMINÉ</h2>
                <p style="font-size: 1.1rem; margin-bottom: 1rem; color: #aef6ff;">Vous avez terminé votre tâche de raffinement avec succès.</p>
                <div style="margin: 2rem 0;">
                    <svg width="60" height="60" viewBox="0 0 120 120" fill="none">
                        <circle cx="60" cy="60" r="55" stroke="#aef6ff" stroke-width="4" />
                        <path d="M30,60 L50,80 L90,40" stroke="#aef6ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <p style="margin-bottom: 2rem; color: #56cbdb;">ACCÈS AU PROFIL EMPLOYÉ ACTIVÉ</p>
                <button id="continue-btn" style="background: transparent; border: 2px solid #aef6ff; color: #aef6ff; padding: 0.75rem 2rem; font-family: 'VT323', monospace; font-size: 1.2rem; cursor: pointer; transition: all 0.3s;">CONTINUER</button>
            </div>
        `;
        
        document.body.appendChild(completionScreen);
        
        // Jouer un son de complétion
        playCompletionSound();
        
        // Configurer le bouton de continuation
        document.getElementById('continue-btn').addEventListener('click', function() {
            // Stocker le statut de complétion
            localStorage.setItem('severanceGameCompleted', 'true');
            
            // Rediriger vers la page Severance CV
            document.body.removeChild(completionScreen);
            document.body.removeChild(gameContainer);
            document.body.style.overflow = '';
            
            // Rediriger vers le CV Severance
            window.location.href = 'severance-cv.html';
        });
    }
    
    // Fonction pour jouer un son de complétion
    function playCompletionSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const notes = [
                { freq: 440, duration: 0.2, delay: 0 },     // La
                { freq: 554.37, duration: 0.2, delay: 0.2 }, // Do#
                { freq: 659.25, duration: 0.4, delay: 0.4 }, // Mi
                { freq: 880, duration: 0.8, delay: 0.8 }     // La (octave supérieure)
            ];
            
            notes.forEach(note => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime + note.delay);
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime + note.delay);
                gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + note.delay + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + note.delay + note.duration);
                
                oscillator.start(audioContext.currentTime + note.delay);
                oscillator.stop(audioContext.currentTime + note.delay + note.duration);
            });
        } catch (err) {
            console.log('Sound play error:', err);
        }
    }
}