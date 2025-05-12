// Script pour l'easter egg de filtrage des données Severance

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'easter egg est déjà visible
    const easterEggExists = document.getElementById('severance-easter-egg');
    if (easterEggExists) return;

    // Créer une fonction pour générer des nombres aléatoires pour les données
    function generateRandomNumbers(count, min, max) {
        const numbers = [];
        for (let i = 0; i < count; i++) {
            numbers.push(Math.floor(Math.random() * (max - min + 1) + min));
        }
        return numbers;
    }

    // Variables pour le suivi de la séquence de touches
    let secretCode = 'mdr';
    let keysPressed = [];
    let keyTimer = null;

    // Ajouter un écouteur d'événement pour le code secret
    document.addEventListener('keydown', function(event) {
        // Réinitialiser le timer à chaque touche
        if (keyTimer) {
            clearTimeout(keyTimer);
        }
        
        // Ajouter la touche au buffer
        keysPressed.push(event.key.toLowerCase());
        
        // Ne garder que les 3 dernières touches (longueur du code secret)
        if (keysPressed.length > secretCode.length) {
            keysPressed.shift();
        }
        
        // Vérifier si les touches actuelles correspondent au code secret
        if (keysPressed.join('') === secretCode) {
            // Code complet - lancer l'easter egg
            keysPressed = [];
            clearTimeout(keyTimer);
            launchDataRefinementGame();
        } else {
            // Définir un timer pour réinitialiser le buffer après un délai
            keyTimer = setTimeout(() => {
                keysPressed = [];
            }, 1500);
        }
    });

    // Fonction pour créer et afficher le jeu de filtrage des données
    function launchDataRefinementGame() {
        // Création du conteneur principal de l'easter egg
        const easterEgg = document.createElement('div');
        easterEgg.id = 'severance-easter-egg';
        easterEgg.className = 'fixed inset-0 bg-severance-dark z-50 flex flex-col overflow-hidden';
        easterEgg.style.fontFamily = "'VT323', monospace";
        
        // En-tête de l'interface
        const header = document.createElement('div');
        header.className = 'p-4 border-b border-gray-700 flex justify-between items-center bg-black bg-opacity-30';
        header.innerHTML = `
            <div class="text-severance-accent text-xl">LUMON INDUSTRIES - MACRO DATA REFINEMENT</div>
            <div class="flex items-center">
                <div class="mr-4 text-severance-accent">Employé: <span class="text-white">GARNIER, A.</span></div>
                <button id="close-easter-egg" class="bg-severance-red hover:bg-red-700 text-white px-3 py-1 rounded">QUITTER</button>
            </div>
        `;
        easterEgg.appendChild(header);
        
        // Corps de l'interface
        const body = document.createElement('div');
        body.className = 'flex-grow flex flex-col md:flex-row';
        
        // Panneau de gauche avec instructions
        const instructions = document.createElement('div');
        instructions.className = 'w-full md:w-1/4 p-6 border-r border-gray-700 bg-black bg-opacity-20';
        instructions.innerHTML = `
            <h3 class="text-severance-accent mb-4">INSTRUCTIONS</h3>
            <p class="text-gray-300 mb-4">Votre tâche consiste à raffiner les données macro en identifiant les nombres qui vous font ressentir une émotion. Triez-les dans les quatre catégories.</p>
            <p class="text-gray-300 mb-4">Cliquez sur un nombre, puis sur la catégorie correspondante.</p>
            <p class="text-gray-300 mb-6">Le mal est effrayant. Le mal est rouge.</p>
            <div class="space-y-2">
                <div class="flex items-center">
                    <div class="w-4 h-4 bg-red-500 mr-2"></div>
                    <div class="text-white">MALVEILLANT</div>
                </div>
                <div class="flex items-center">
                    <div class="w-4 h-4 bg-green-500 mr-2"></div>
                    <div class="text-white">JOYEUX</div>
                </div>
                <div class="flex items-center">
                    <div class="w-4 h-4 bg-yellow-500 mr-2"></div>
                    <div class="text-white">EFFRAYANT</div>
                </div>
                <div class="flex items-center">
                    <div class="w-4 h-4 bg-blue-500 mr-2"></div>
                    <div class="text-white">MÉLANCOLIQUE</div>
                </div>
            </div>
            <div class="mt-8 p-4 border border-gray-600 bg-black bg-opacity-30 scanning-effect">
                <p class="text-severance-accent">Niveau de progression actuel: <span id="progress-value" class="text-white">0%</span></p>
                <div class="mt-2 bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div id="progress-bar" class="bg-severance-accent h-full" style="width: 0%"></div>
                </div>
            </div>
        `;
        body.appendChild(instructions);
        
        // Panneau principal avec les données à filtrer et les catégories
        const mainPanel = document.createElement('div');
        mainPanel.className = 'w-full md:w-3/4 flex flex-col';
        
        // Zone des nombres à filtrer
        const dataArea = document.createElement('div');
        dataArea.className = 'flex-grow p-6 relative overflow-auto waffle-party';
        dataArea.innerHTML = `
            <div class="scanlines"></div>
            <div class="vignette"></div>
            <h3 class="text-severance-accent mb-6">DONNÉES À RAFFINER</h3>
            <div id="data-grid" class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-10 gap-4"></div>
        `;
        mainPanel.appendChild(dataArea);
        
        // Catégories pour le filtrage
        const categories = document.createElement('div');
        categories.className = 'grid grid-cols-2 md:grid-cols-4 border-t border-gray-700';
        categories.innerHTML = `
            <div id="cat-malveillant" class="category p-6 text-center border-r border-gray-700 cursor-pointer hover:bg-red-900 hover:bg-opacity-30 transition-colors">
                <div class="text-red-500 text-lg mb-2">MALVEILLANT</div>
                <div id="count-malveillant" class="text-white text-3xl">0</div>
            </div>
            <div id="cat-joyeux" class="category p-6 text-center border-r border-gray-700 cursor-pointer hover:bg-green-900 hover:bg-opacity-30 transition-colors">
                <div class="text-green-500 text-lg mb-2">JOYEUX</div>
                <div id="count-joyeux" class="text-white text-3xl">0</div>
            </div>
            <div id="cat-effrayant" class="category p-6 text-center border-r border-gray-700 cursor-pointer hover:bg-yellow-900 hover:bg-opacity-30 transition-colors">
                <div class="text-yellow-500 text-lg mb-2">EFFRAYANT</div>
                <div id="count-effrayant" class="text-white text-3xl">0</div>
            </div>
            <div id="cat-melancolique" class="category p-6 text-center cursor-pointer hover:bg-blue-900 hover:bg-opacity-30 transition-colors">
                <div class="text-blue-500 text-lg mb-2">MÉLANCOLIQUE</div>
                <div id="count-melancolique" class="text-white text-3xl">0</div>
            </div>
        `;
        mainPanel.appendChild(categories);
        body.appendChild(mainPanel);
        easterEgg.appendChild(body);
        
        // Ajouter le tout au corps du document
        document.body.appendChild(easterEgg);
        document.body.style.overflow = 'hidden'; // Empêcher le défilement pendant le jeu
        
        // Générer les nombres pour le jeu
        generateDataNumbers();
        
        // Ajouter un gestionnaire d'événements pour fermer l'easter egg
        document.getElementById('close-easter-egg').addEventListener('click', function() {
            document.body.removeChild(easterEgg);
            document.body.style.overflow = ''; // Restaurer le défilement
        });
    }
    
    // Variables pour le jeu
    let selectedNumber = null;
    let totalProcessed = 0;
    const targetToComplete = 25; // Nombre de données à traiter pour compléter le jeu
    const categories = ['malveillant', 'joyeux', 'effrayant', 'melancolique'];
    
    // Fonction pour générer les nombres pour le jeu
    function generateDataNumbers() {
        const dataGrid = document.getElementById('data-grid');
        if (!dataGrid) return;
        
        dataGrid.innerHTML = '';
        const numbers = generateRandomNumbers(40, 1, 99);
        
        numbers.forEach(number => {
            const numberElem = document.createElement('div');
            numberElem.className = 'number-item p-4 bg-severance-dark text-center text-severance-accent text-xl cursor-pointer hover:bg-opacity-80 transition-all border border-gray-700';
            numberElem.textContent = number;
            numberElem.dataset.value = number;
            
            numberElem.addEventListener('click', function() {
                // Désélectionner tous les autres nombres
                document.querySelectorAll('.number-item').forEach(item => {
                    item.classList.remove('ring-2', 'ring-severance-accent');
                });
                
                // Sélectionner ce nombre
                this.classList.add('ring-2', 'ring-severance-accent');
                selectedNumber = this;
            });
            
            dataGrid.appendChild(numberElem);
        });
        
        // Ajouter les événements pour les catégories
        categories.forEach(cat => {
            document.getElementById(`cat-${cat}`).addEventListener('click', function() {
                if (!selectedNumber) return;
                
                // Traiter le nombre sélectionné
                processNumber(cat);
            });
        });
    }
    
    // Fonction pour traiter un nombre sélectionné
    function processNumber(category) {
        if (!selectedNumber) return;
        
        // Incrémenter le compteur de la catégorie
        const countElem = document.getElementById(`count-${category}`);
        let count = parseInt(countElem.textContent);
        countElem.textContent = ++count;
        
        // Animation de disparition pour le nombre traité
        selectedNumber.classList.add('opacity-0', 'scale-90');
        setTimeout(() => {
            if (selectedNumber.parentNode) {
                selectedNumber.parentNode.removeChild(selectedNumber);
            }
            selectedNumber = null;
            
            // Mettre à jour la progression
            totalProcessed++;
            updateProgress();
            
            // Vérifier si nous avons terminé ou s'il faut ajouter de nouveaux nombres
            if (document.querySelectorAll('.number-item').length < 10) {
                addMoreNumbers(5);
            }
            
            checkCompletion();
        }, 300);
    }
    
    // Ajouter plus de nombres au jeu
    function addMoreNumbers(count) {
        const dataGrid = document.getElementById('data-grid');
        if (!dataGrid) return;
        
        const numbers = generateRandomNumbers(count, 1, 99);
        
        numbers.forEach(number => {
            const numberElem = document.createElement('div');
            numberElem.className = 'number-item p-4 bg-severance-dark text-center text-severance-accent text-xl cursor-pointer hover:bg-opacity-80 transition-all border border-gray-700 opacity-0 scale-90';
            numberElem.textContent = number;
            numberElem.dataset.value = number;
            
            numberElem.addEventListener('click', function() {
                document.querySelectorAll('.number-item').forEach(item => {
                    item.classList.remove('ring-2', 'ring-severance-accent');
                });
                this.classList.add('ring-2', 'ring-severance-accent');
                selectedNumber = this;
            });
            
            dataGrid.appendChild(numberElem);
            
            // Animation d'apparition
            setTimeout(() => {
                numberElem.classList.remove('opacity-0', 'scale-90');
            }, 50);
        });
    }
    
    // Mettre à jour la barre de progression
    function updateProgress() {
        const progressBar = document.getElementById('progress-bar');
        const progressValue = document.getElementById('progress-value');
        if (!progressBar || !progressValue) return;
        
        const percent = Math.min(100, Math.round((totalProcessed / targetToComplete) * 100));
        progressBar.style.width = `${percent}%`;
        progressValue.textContent = `${percent}%`;
    }
    
    // Vérifier si le jeu est terminé
    function checkCompletion() {
        if (totalProcessed >= targetToComplete) {
            // Afficher un message de félicitations
            setTimeout(() => {
                showCompletionMessage();
            }, 500);
        }
    }
    
    // Afficher le message de fin de jeu
    function showCompletionMessage() {
        const easterEgg = document.getElementById('severance-easter-egg');
        if (!easterEgg) return;
        
        const completionOverlay = document.createElement('div');
        completionOverlay.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
        
        const message = document.createElement('div');
        message.className = 'bg-severance-dark p-8 max-w-lg text-center rounded shadow-lg border border-severance-accent scanning-effect';
        message.innerHTML = `
            <h2 class="text-severance-accent text-3xl mb-6">FELICITATIONS</h2>
            <p class="text-white text-xl mb-4">Vous avez terminé votre tâche de raffinage des données avec succès.</p>
            <p class="text-gray-400 mb-6">Vous avez raffiné ${totalProcessed} éléments de données.</p>
            <p class="text-severance-accent text-lg mb-8">Un total de points d'expérience a été ajouté à votre solde.</p>
            
            <div class="mb-8">
                <p class="text-white mb-2">Vous avez débloqué l'accès au CV interactif.</p>
                <p class="text-gray-400">Une version spéciale de votre CV est maintenant disponible.</p>
            </div>
            
            <div class="flex justify-center space-x-4">
                <button id="close-completion" class="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded">Fermer</button>
                <button id="view-special-cv" class="bg-severance-accent hover:bg-blue-400 text-severance-dark px-5 py-2 rounded font-bold">Voir CV Spécial</button>
            </div>
        `;
        
        completionOverlay.appendChild(message);
        easterEgg.appendChild(completionOverlay);
        
        // Ajouter les événements pour les boutons
        document.getElementById('close-completion').addEventListener('click', function() {
            document.body.removeChild(easterEgg);
            document.body.style.overflow = '';
            
            // Enregistrer la progression dans le localStorage
            localStorage.setItem('severanceGameCompleted', 'true');
        });
        
        document.getElementById('view-special-cv').addEventListener('click', function() {
            document.body.removeChild(easterEgg);
            document.body.style.overflow = '';
            
            // Enregistrer la progression et rediriger vers le CV spécial
            localStorage.setItem('severanceGameCompleted', 'true');
            window.location.href = 'severance-cv.html';
        });
    }
});

/**
 * Jeu de raffinement de données inspiré de Severance
 * Les joueurs doivent trier intuitivement des nombres qui provoquent des émotions
 */

// Variables globales pour le jeu de raffinement
let dataGame = null;
let dataRefinementActive = false;
let numbersToRefine = [];
let bins = ['effrayant', 'triste', 'joyeux', 'malveillant'];
let completedNumbers = 0;
let totalNumbers = 0;
let gameStartTime = 0;
let lumonEasterEggs = [
    "LES NOMBRES RACONTENT DES SECRETS",
    "TRIEZ POUR ÊTRE LIBÉRÉ",
    "FAITES CONFIANCE AU PROCESSUS",
    "RAFFINEMENT = LIBERTÉ",
    "NOUS AVONS BESOIN DE VOUS"
];

/**
 * Fonction principale pour lancer le jeu de raffinement des données
 * Cette fonction est exposée globalement pour pouvoir être appelée depuis mac-animation.js
 */
function launchDataRefinementGame() {
    console.log("Lancement du jeu de raffinement des données");
    // S'assurer que le jeu ne se lance pas deux fois
    if (dataRefinementActive || document.getElementById('data-refinement-game')) {
        console.log("Le jeu est déjà actif");
        return;
    }
    
    dataRefinementActive = true;

    // Créer l'interface du jeu
    createDataRefinementInterface();
    
    // Jouer la séquence d'intro
    playIntroSequence(() => {
        // Initialiser et démarrer le jeu
        initializeDataGame();
    });
}

// Fonction pour jouer un son d'ambiance
function playRefinementSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'placement':
                const freq = 300 + Math.random() * 300;
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
                
            case 'completion':
                const notes = [
                    { freq: 440, duration: 0.2, delay: 0 },     // La
                    { freq: 554.37, duration: 0.2, delay: 0.2 }, // Do#
                    { freq: 659.25, duration: 0.4, delay: 0.4 }, // Mi
                    { freq: 880, duration: 0.8, delay: 0.8 }     // La (octave supérieure)
                ];
                
                notes.forEach(note => {
                    const noteOsc = audioContext.createOscillator();
                    const noteGain = audioContext.createGain();
                    
                    noteOsc.connect(noteGain);
                    noteGain.connect(audioContext.destination);
                    
                    noteOsc.type = 'sine';
                    noteOsc.frequency.setValueAtTime(note.freq, audioContext.currentTime + note.delay);
                    
                    noteGain.gain.setValueAtTime(0, audioContext.currentTime + note.delay);
                    noteGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + note.delay + 0.05);
                    noteGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + note.delay + note.duration);
                    
                    noteOsc.start(audioContext.currentTime + note.delay);
                    noteOsc.stop(audioContext.currentTime + note.delay + note.duration);
                });
                break;
        }
    } catch (err) {
        console.log('Sound play error:', err);
    }
}

// Créer l'interface du jeu
function createDataRefinementInterface() {
    console.log("Création de l'interface du jeu de raffinement");
    
    // Créer l'élément principal du jeu
    dataGame = document.createElement('div');
    dataGame.id = 'data-refinement-game';
    dataGame.className = 'data-refinement-container';
    
    const gameHTML = `
        <div class="data-refinement-overlay"></div>
        <div class="data-refinement-interface">
            <div class="data-refinement-header">
                <div class="dr-logo">
                    <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="45" stroke="#aef6ff" stroke-width="3" />
                        <path d="M30,50 L70,50" stroke="#aef6ff" stroke-width="3" />
                        <path d="M50,30 L50,70" stroke="#aef6ff" stroke-width="3" />
                    </svg>
                </div>
                <h2 class="dr-title">MACRO DATA REFINEMENT</h2>
                <div class="dr-progress">
                    <div class="dr-progress-text">0%</div>
                    <div class="dr-progress-bar">
                        <div class="dr-progress-fill"></div>
                    </div>
                </div>
                <div class="dr-session-info">
                    Session #8722 | <span class="dr-timer">00:00</span>
                </div>
            </div>
            
            <div class="data-refinement-intro">
                <div class="dr-intro-text">INITIALISATION DU SYSTÈME MDR</div>
                <div class="dr-loader">
                    <div class="dr-loader-bar"></div>
                </div>
                <div class="dr-lumon-message mt-6 opacity-0">Trouvez les nombres qui résonnent émotionnellement avec vous</div>
            </div>
            
            <div class="data-refinement-workspace" style="display:none;">
                <div class="flex flex-col h-full">
                    <div class="text-center mb-4">
                        <p class="text-lg text-severance-accent">IDENTIFIEZ LES NOMBRES QUI ÉVOQUENT DES ÉMOTIONS</p>
                        <p class="text-sm opacity-70">Faites glisser les nombres dans la catégorie qui correspond à votre ressenti</p>
                    </div>
                    
                    <div class="flex-grow flex flex-col md:flex-row">
                        <div class="data-numbers-area w-full md:w-5/12 p-4 border border-severance-accent bg-opacity-20 bg-severance-dark mb-4 md:mb-0 md:mr-4">
                            <div class="text-center mb-2 text-sm">NOMBRES À RAFFINER</div>
                            <div class="data-numbers-container flex flex-wrap justify-center gap-2"></div>
                        </div>
                        
                        <div class="data-bins-area flex-grow grid grid-cols-2 gap-3">
                            ${bins.map((bin, index) => `
                                <div class="data-bin h-full" data-bin="${bin}">
                                    <div class="bin-header text-center py-2 font-bold text-${getBinColor(bin)}">
                                        ${bin.toUpperCase()}
                                    </div>
                                    <div class="bin-drop-zone h-full border border-dashed border-${getBinColor(bin)} p-3 flex flex-wrap content-start gap-2"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="data-refinement-complete" style="display:none;">
                <div class="dr-complete-text">RAFFINEMENT TERMINÉ</div>
                <div class="dr-complete-subtext">Les données ont été correctement raffinées.</div>
                <div class="dr-complete-stats">
                    <div>Temps total: <span id="dr-total-time">00:00</span></div>
                    <div>Nombres raffinés: <span id="dr-refined-count">0</span></div>
                    <div>Précision: 100%</div>
                </div>
                <div class="dr-reward">
                    <svg width="60" height="60" viewBox="0 0 120 120" fill="none">
                        <circle cx="60" cy="60" r="55" stroke="#aef6ff" stroke-width="4" />
                        <path d="M30,60 L50,80 L90,40" stroke="#aef6ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="dr-reward-text">ACCÈS ACTIVÉ</div>
                    <button id="dr-continue-btn" class="dr-button">CONTINUER</button>
                </div>
            </div>
        </div>
    `;
    
    dataGame.innerHTML = gameHTML;
    document.body.appendChild(dataGame);
    console.log("Interface du jeu ajoutée au DOM");

    // Désactiver le défilement du body pendant le jeu
    document.body.style.overflow = 'hidden';
}

// Fonction helper pour obtenir la couleur correspondant à la catégorie
function getBinColor(bin) {
    switch(bin.toLowerCase()) {
        case 'effrayant': return 'yellow-500';
        case 'triste': return 'blue-500';
        case 'joyeux': return 'green-500';
        case 'malveillant': return 'red-500';
        default: return 'severance-accent';
    }
}

// Jouer la séquence d'introduction
function playIntroSequence(callback) {
    console.log("Démarrage de la séquence d'introduction");
    
    const intro = document.querySelector('.data-refinement-intro');
    const workspace = document.querySelector('.data-refinement-workspace');
    
    if (!intro || !workspace) {
        console.error("Éléments d'intro ou de workspace non trouvés");
        return;
    }
    
    // Animer le texte d'intro avec un effet de machine à écrire
    const introText = document.querySelector('.dr-intro-text');
    if (introText) {
        const originalText = introText.textContent;
        introText.textContent = '';
        
        let charIndex = 0;
        const typeEffect = setInterval(() => {
            if (charIndex < originalText.length) {
                introText.textContent += originalText.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeEffect);
                
                // Afficher progressivement le message Lumon
                const lumonMessage = document.querySelector('.dr-lumon-message');
                if (lumonMessage) {
                    setTimeout(() => {
                        lumonMessage.style.opacity = '1';
                        lumonMessage.style.transition = 'opacity 1s ease';
                    }, 500);
                }
            }
        }, 40);
    }
    
    // Attendre que la barre de chargement finisse son animation
    setTimeout(() => {
        intro.style.display = 'none';
        workspace.style.display = 'flex';
        if (callback) callback();
    }, 5000);
}

// Initialiser le jeu
function initializeDataGame() {
    console.log("Initialisation du jeu de raffinement");
    
    // Générer des nombres pour le raffinement
    generateNumbersToRefine();
    
    // Configurer le glisser-déposer
    setupDragAndDrop();
    
    // Démarrer le chronomètre
    startTimer();
    
    // Mettre à jour la barre de progression
    updateProgress();
}

// Générer des nombres à raffiner
function generateNumbersToRefine() {
    const numbersContainer = document.querySelector('.data-numbers-container');
    if (!numbersContainer) {
        console.error("Conteneur de nombres non trouvé");
        return;
    }
    
    numbersContainer.innerHTML = '';
    
    // Nombres spécifiques qui peuvent évoquer des émotions
    const numberGroups = [
        { value: "42 18 91", category: "effrayant" },
        { value: "17 53 29", category: "triste" },
        { value: "73 91 14", category: "joyeux" },
        { value: "82 32 05", category: "malveillant" },
        { value: "64 27 89", category: "effrayant" },
        { value: "31 08 76", category: "triste" },
        { value: "59 42 13", category: "joyeux" },
        { value: "66 23 77", category: "malveillant" },
        { value: "04 92 61", category: "effrayant" },
        { value: "15 47 36", category: "triste" },
        { value: "50 33 27", category: "joyeux" },
        { value: "28 63 90", category: "malveillant" }
    ];
    
    // Mélanger les nombres
    const shuffledNumbers = [...numberGroups].sort(() => Math.random() - 0.5);
    
    // Limiter le nombre de groupes pour ne pas surcharger l'interface
    const selectedNumbers = shuffledNumbers.slice(0, 9);
    
    console.log(`Génération de ${selectedNumbers.length} groupes de nombres pour le raffinement`);
    
    // Créer les éléments HTML pour chaque nombre
    selectedNumbers.forEach(group => {
        const numberElement = document.createElement('div');
        numberElement.className = 'data-number';
        numberElement.textContent = group.value;
        numberElement.setAttribute('data-category', group.category);
        numberElement.setAttribute('draggable', 'true');
        
        // Ajouter l'élément au conteneur
        numbersContainer.appendChild(numberElement);
    });
    
    // Mettre à jour le compteur total
    totalNumbers = selectedNumbers.length;
    completedNumbers = 0;
}

// Configurer le système de glisser-déposer
function setupDragAndDrop() {
    const dataNumbers = document.querySelectorAll('.data-number');
    const dropZones = document.querySelectorAll('.bin-drop-zone');
    
    if (!dataNumbers.length || !dropZones.length) {
        console.error("Éléments de glisser-déposer non trouvés");
        return;
    }
    
    console.log(`Configuration du glisser-déposer pour ${dataNumbers.length} nombres et ${dropZones.length} zones`);
    
    let draggedElement = null;
    
    // Configurer chaque nombre pour le glisser-déposer
    dataNumbers.forEach(number => {
        number.addEventListener('dragstart', function(e) {
            this.classList.add('dragging');
            draggedElement = this;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.textContent);
        });
        
        number.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    // Configurer les zones de dépôt
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('highlight');
        });
        
        zone.addEventListener('dragleave', function() {
            this.classList.remove('highlight');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('highlight');
            
            if (draggedElement) {
                // Aucune règle stricte - tout tri est "correct" dans l'esprit de Severance
                // L'intuition est le guide pour le raffinement
                const numberClone = draggedElement.cloneNode(true);
                numberClone.style.transform = '';
                numberClone.classList.remove('dragging');
                
                // Garantir que le nombre ne peut plus être déplacé une fois placé
                numberClone.setAttribute('draggable', 'false');
                
                // Ajouter une classe spéciale pour l'animation et le style dans le bin
                numberClone.classList.add('refined-number');
                
                this.appendChild(numberClone);
                
                // Supprimer l'original
                if (draggedElement.parentNode) {
                    draggedElement.parentNode.removeChild(draggedElement);
                }
                
                // Son de placement
                playRefinementSound('placement');
                
                // Mettre à jour le compteur
                completedNumbers++;
                updateProgress();
                
                // Ajouter des nombres supplémentaires si nécessaire
                if (document.querySelectorAll('.data-numbers-container .data-number').length < 3) {
                    addMoreNumbersToRefine();
                }
                
                // Vérifier si suffisamment de nombres ont été triés pour terminer
                if (completedNumbers >= 15) {
                    setTimeout(completeRefinement, 1000);
                }
            }
        });
    });
}

// Ajouter plus de nombres à raffiner
function addMoreNumbersToRefine() {
    // Nouveaux groupes de nombres avec des valeurs différentes
    const additionalGroups = [
        { value: "19 46 78", category: "effrayant" },
        { value: "25 67 12", category: "triste" },
        { value: "81 39 54", category: "joyeux" },
        { value: "70 11 93", category: "malveillant" },
        { value: "58 84 30", category: "effrayant" },
        { value: "21 49 75", category: "triste" }
    ];
    
    const numbersContainer = document.querySelector('.data-numbers-container');
    if (!numbersContainer) return;
    
    // Mélanger et sélectionner quelques groupes
    const shuffled = [...additionalGroups].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3); // Ajouter 3 groupes à la fois
    
    selected.forEach(group => {
        const numberElement = document.createElement('div');
        numberElement.className = 'data-number';
        numberElement.textContent = group.value;
        numberElement.setAttribute('data-category', group.category);
        numberElement.setAttribute('draggable', 'true');
        
        // Animation d'apparition
        numberElement.style.opacity = '0';
        numberElement.style.transform = 'scale(0.8)';
        
        // Ajouter l'élément au conteneur
        numbersContainer.appendChild(numberElement);
        
        // Configurer le drag & drop pour ce nouvel élément
        numberElement.addEventListener('dragstart', function(e) {
            this.classList.add('dragging');
            draggedElement = this;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.textContent);
        });
        
        numberElement.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
        
        // Déclencher l'animation d'apparition
        setTimeout(() => {
            numberElement.style.opacity = '1';
            numberElement.style.transform = 'scale(1)';
            numberElement.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 100);
    });
    
    // Augmenter le total
    totalNumbers += selected.length;
}

// Démarrer le chronomètre
function startTimer() {
    gameStartTime = Date.now();
    const timerElement = document.querySelector('.dr-timer');
    
    if (!timerElement) return;
    
    const timerInterval = setInterval(() => {
        if (!dataRefinementActive) {
            clearInterval(timerInterval);
            return;
        }
        
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - gameStartTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
        const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
        
        timerElement.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// Mettre à jour la barre de progression
function updateProgress() {
    if (totalNumbers === 0) return;
    
    // On va limiter la progression à un maximum de 100%
    const targetNumbers = 15; // Nombre cible pour 100%
    const progressPercentage = Math.min(100, Math.floor((completedNumbers / targetNumbers) * 100));
    
    const progressFill = document.querySelector('.dr-progress-fill');
    const progressText = document.querySelector('.dr-progress-text');
    
    if (progressFill) progressFill.style.width = progressPercentage + '%';
    if (progressText) progressText.textContent = progressPercentage + '%';
    
    console.log(`Progression du jeu : ${progressPercentage}% (${completedNumbers}/${targetNumbers})`);
}

// Compléter le raffinement des données
function completeRefinement() {
    console.log("Raffinement des données terminé");
    
    const workspace = document.querySelector('.data-refinement-workspace');
    const complete = document.querySelector('.data-refinement-complete');
    
    if (!workspace || !complete) {
        console.error("Éléments de complétion non trouvés");
        return;
    }
    
    // Calculer le temps total
    const totalSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    
    const totalTimeElement = document.getElementById('dr-total-time');
    const refinedCountElement = document.getElementById('dr-refined-count');
    
    if (totalTimeElement) totalTimeElement.textContent = `${minutes}:${seconds}`;
    if (refinedCountElement) refinedCountElement.textContent = completedNumbers;
    
    // Jouer un son de complétion
    playRefinementSound('completion');
    
    // Afficher l'écran de complétion
    workspace.style.display = 'none';
    complete.style.display = 'flex';
    
    // Configurer le bouton de continuation
    const continueButton = document.getElementById('dr-continue-btn');
    if (continueButton) {
        continueButton.addEventListener('click', function() {
            // Marquer comme complété dans le stockage local
            localStorage.setItem('severanceGameCompleted', 'true');
            
            // Nettoyer l'interface du jeu
            cleanupDataRefinementGame();
            
            // Rediriger vers la page Easter egg Severance
            setTimeout(() => {
                // Redirection garantie
                window.location.href = 'severance-cv.html';
            }, 500);
        });
    }
}

// Nettoyer le jeu de raffinement
function cleanupDataRefinementGame() {
    console.log("Nettoyage du jeu de raffinement");
    
    if (dataGame) {
        dataGame.remove();
        dataGame = null;
        dataRefinementActive = false;
        
        // Réactiver le défilement du body
        document.body.style.overflow = '';
    }
}

// Exposer la fonction globalement pour qu'elle soit accessible depuis mac-animation.js
window.launchDataRefinementGame = launchDataRefinementGame;

// Garantir que la fonction est disponible immédiatement
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log("Document déjà chargé, la fonction est prête");
} else {
    document.addEventListener('DOMContentLoaded', function() {
        console.log("Document chargé, la fonction est prête");
    });
}