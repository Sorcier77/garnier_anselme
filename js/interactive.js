// Variables globales pour la calculatrice
let currentInput = '0';
let previousInput = '0';
let operation = null;
let resetScreen = false;

// Fonctions de la calculatrice
function updateScreen() {
    const screen = document.getElementById('calculatorScreen');
    if (screen) {
        screen.textContent = currentInput;
    }
}

function calculatorAddDigit(digit) {
    if (currentInput === '0' || resetScreen) {
        currentInput = digit;
        resetScreen = false;
    } else {
        currentInput += digit;
    }
    updateScreen();
}

function calculatorOperation(op) {
    if (operation !== null) calculatorCalculate();
    previousInput = currentInput;
    operation = op;
    resetScreen = true;
}

function calculatorClear() {
    currentInput = '0';
    previousInput = '0';
    operation = null;
    updateScreen();
}

function calculatorDelete() {
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateScreen();
}

function calculatorCalculate() {
    if (operation === null) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
        default:
            return;
    }

    // Accès secret: si le résultat est 1984
    if (result === 1984) {
        currentInput = "ACCESS GRANTED";
        setTimeout(() => {
            window.location.href = "contact.html";
        }, 2000);
    } else {
        currentInput = String(result);
    }
    
    operation = null;
    updateScreen();
}

// Questionnaire data
const questionnaire = [
    {
        qlabel: "Quel langage est principalement utilisé pour le style web?",
        qid: 1,
        reponses: [
            { rlabel: "JavaScript", rid: 1 },
            { rlabel: "HTML", rid: 2 },
            { rlabel: "CSS", rid: 3 },
            { rlabel: "PHP", rid: 4 }
        ]
    },
    {
        qlabel: "Quel framework CSS est utilisé dans ce portfolio?",
        qid: 2,
        reponses: [
            { rlabel: "Bootstrap", rid: 1 },
            { rlabel: "Tailwind CSS", rid: 2 },
            { rlabel: "Bulma", rid: 3 },
            { rlabel: "Foundation", rid: 4 }
        ]
    },
    {
        qlabel: "Quelle bibliothèque de composants est utilisée avec Tailwind dans ce portfolio?",
        qid: 3,
        reponses: [
            { rlabel: "Material UI", rid: 1 },
            { rlabel: "Chakra UI", rid: 2 },
            { rlabel: "DaisyUI", rid: 3 },
            { rlabel: "Ant Design", rid: 4 }
        ]
    }
];

// Fonctions pour le questionnaire
document.addEventListener("DOMContentLoaded", function() {
    // Initialiser l'affichage de la calculatrice
    updateScreen();
    
    // Initialiser le questionnaire
    let currentQuestionIndex = 0;
    let userAnswers = [];
    const correctAnswers = [3, 2, 3]; // CSS, Tailwind CSS, DaisyUI
    
    function displayQuestion() {
        const questionContainer = document.getElementById('question-display');
        if (!questionContainer) return;
        
        const question = questionnaire[currentQuestionIndex];
        if (!question) return;
        
        let html = `
            <div class="mb-4">
                <h3 class="font-bold text-lg mb-4">${question.qlabel}</h3>
                <div class="space-y-3">
        `;
        
        question.reponses.forEach(reponse => {
            html += `
                <div class="form-control">
                    <label class="cursor-pointer flex items-center p-3 border rounded-lg hover:bg-blue-50 transition-colors">
                        <input type="radio" name="question-${question.qid}" value="${reponse.rid}" class="radio radio-primary mr-3">
                        <span class="label-text">${reponse.rlabel}</span>
                    </label>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
            <div class="flex justify-between mt-6">
                ${currentQuestionIndex > 0 ? '<button class="btn btn-outline" id="prev-question">Précédent</button>' : '<div></div>'}
                <button class="btn bg-blue-500 hover:bg-blue-600 border-none text-white" id="next-question">${currentQuestionIndex < questionnaire.length - 1 ? 'Suivant' : 'Valider'}</button>
            </div>
        `;
        
        questionContainer.innerHTML = html;
        
        // Ajouter les écouteurs d'événements pour les boutons
        if (currentQuestionIndex > 0) {
            document.getElementById('prev-question').addEventListener('click', previousQuestion);
        }
        document.getElementById('next-question').addEventListener('click', nextQuestion);
    }
    
    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    }
    
    function nextQuestion() {
        // Enregistrer la réponse actuelle
        const selectedOption = document.querySelector(`input[name="question-${questionnaire[currentQuestionIndex].qid}"]:checked`);
        if (!selectedOption && currentQuestionIndex < questionnaire.length) {
            showAlert("Veuillez sélectionner une réponse", "alert-warning");
            return;
        }
        
        if (selectedOption) {
            userAnswers[currentQuestionIndex] = parseInt(selectedOption.value);
        }
        
        if (currentQuestionIndex < questionnaire.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            // C'est la dernière question, vérifier les réponses
            checkAnswers();
        }
    }
    
    function showAlert(message, alertClass) {
        const resultMessage = document.getElementById('result-message');
        resultMessage.className = `alert ${alertClass} shadow-lg`;
        resultMessage.textContent = message;
        resultMessage.classList.remove('hidden');
        
        // Masquer l'alerte après 5 secondes
        setTimeout(() => {
            resultMessage.classList.add('hidden');
        }, 5000);
    }
    
    function checkAnswers() {
        let allCorrect = true;
        for (let i = 0; i < correctAnswers.length; i++) {
            if (userAnswers[i] !== correctAnswers[i]) {
                allCorrect = false;
                break;
            }
        }
        
        if (allCorrect) {
            showAlert("Bravo ! Vous avez répondu correctement à toutes les questions.", "alert-success");
            setTimeout(() => {
                window.location.href = "contact.html";
            }, 1500);
        } else {
            showAlert("Certaines réponses sont incorrectes. Essayez à nouveau.", "alert-error");
            // Réinitialiser pour recommencer
            currentQuestionIndex = 0;
            userAnswers = [];
            displayQuestion();
        }
    }
    
    // Brute force button
    const bruteForceBtn = document.getElementById('bruteForceBtn');
    if (bruteForceBtn) {
        bruteForceBtn.addEventListener('click', function() {
            // Désactiver le bouton pendant l'exécution
            bruteForceBtn.disabled = true;
            bruteForceBtn.textContent = "En cours...";
            bruteForceBtn.classList.add('opacity-70');
            
            // Afficher un message explicatif
            showAlert("Tentative de brute force en cours...", "alert-info");
            
            let attempts = 0;
            const maxAttempts = 25; // Simuler 25 tentatives max
            const totalCombinations = questionnaire.reduce((acc, q) => acc * q.reponses.length, 1);
            
            // Fonction pour simuler l'essai d'une combinaison
            function tryCombination() {
                attempts++;
                
                // Générer une combinaison aléatoire pour l'effet visuel
                const randomAnswers = [];
                for (let i = 0; i < questionnaire.length; i++) {
                    randomAnswers.push(Math.floor(Math.random() * questionnaire[i].reponses.length) + 1);
                }
                
                // Afficher la tentative actuelle
                showAlert(`Essai ${attempts}/${maxAttempts}: Test de la combinaison [${randomAnswers.join(', ')}]`, "alert-info");
                
                // Simuler un délai pour chaque tentative
                setTimeout(() => {
                    // Si on a atteint l'avant-dernière tentative ou le nombre max, on trouve la bonne réponse
                    if (attempts >= maxAttempts - 1 || attempts >= totalCombinations - 1) {
                        // Dernière tentative, trouver la bonne réponse!
                        showAlert("Combinaison trouvée: [3, 2, 3] ✓", "alert-success");
                        
                        setTimeout(() => {
                            // Animation de "hacking réussi"
                            const hackingText = document.createElement('div');
                            hackingText.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50';
                            hackingText.innerHTML = `
                                <div class="text-green-500 text-2xl font-mono text-center">
                                    <p class="mb-4">[ ACCÈS ACQUIS ]</p>
                                    <div class="flex justify-center items-center space-x-2">
                                        <span class="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                                        <span class="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></span>
                                        <span class="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse" style="animation-delay: 0.4s"></span>
                                    </div>
                                    <p class="mt-4 animate-pulse">Redirection vers la page protégée...</p>
                                </div>
                            `;
                            document.body.appendChild(hackingText);
                            
                            // Rediriger après une courte animation
                            setTimeout(() => {
                                window.location.href = "contact.html";
                            }, 2000);
                        }, 1000);
                        
                    } else {
                        // Continuer les essais
                        tryCombination();
                    }
                }, 200); // Vitesse de chaque tentative
            }
            
            // Démarrer le processus de brute force
            tryCombination();
        });
    }

    // Ajouter un écouteur d'événements pour le bouton de réinitialisation
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Réinitialiser les réponses de l'utilisateur
            userAnswers = [];
            currentQuestionIndex = 0;
            displayQuestion();
            showAlert("Le questionnaire a été réinitialisé.", "alert-info");
        });
    }

    // Initialiser l'affichage du questionnaire
    if (document.getElementById('question-display')) {
        displayQuestion();
    }
    
    // Effet machine à écrire pour l'écran rétro
    const typingElements = document.querySelectorAll('.typing-effect span');
    let delay = 0;
    
    typingElements.forEach((element, index) => {
        const text = element.textContent;
        element.textContent = '';
        delay += 1000; // Délai entre chaque ligne
        
        setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 50); // Vitesse de frappe
        }, delay);
    });
});