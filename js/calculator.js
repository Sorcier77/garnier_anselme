/**
 * Fonctionnalités de la calculatrice secrète
 */

// Variables globales pour la calculatrice
let currentInput = '0';
let previousInput = '0';
let operation = null;
let resetScreen = false;

// Initialisation de la calculatrice au chargement du document
document.addEventListener("DOMContentLoaded", function() {
    // Gestion du bouton de la calculatrice
    const toggleCalculatorBtn = document.getElementById('toggleCalculator');
    const calculatrice = document.getElementById('calculatrice');
    
    if (toggleCalculatorBtn && calculatrice) {
        // La calculette ne se montre que lorsqu'on appuie sur le bouton (inversé)
        calculatrice.classList.remove('visible'); // S'assurer qu'elle est cachée au départ
        
        toggleCalculatorBtn.addEventListener('click', function() {
            calculatrice.classList.toggle('visible');
            toggleCalculatorBtn.classList.toggle('active');
        });
    }
    
    // Initialiser l'affichage de la calculatrice
    updateScreen();
});

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
        currentInput = "ACCÈS AUTORISÉ";
        setTimeout(() => {
            window.location.href = "severance.html"; 
        }, 2000);
    } else {
        currentInput = String(result);
    }
    
    operation = null;
    updateScreen();
}
