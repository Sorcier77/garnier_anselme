// Script principal du site - initialisation et fonctionnalités générales

document.addEventListener("DOMContentLoaded", function() {
    // Animations au défilement
    initScrollAnimations();
    
    // Animations de la barre de navigation
    initNavbarAnimations();
    
    // Effet machine à écrire
    initTypewriterEffect();
});

// Fonction pour initialiser les animations au défilement
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in, .fade-from-left, .fade-from-right, .scale-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// Fonction pour initialiser les animations de la barre de navigation
function initNavbarAnimations() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            navbar.classList.add('stuck');
        } else {
            navbar.classList.remove('stuck');
        }
        lastScrollTop = scrollTop;

        // Gérer l'instruction de défilement
        const scrollInstruction = document.getElementById('scroll-instruction');
        if (scrollInstruction) {
            if (scrollTop > 100) {
                scrollInstruction.classList.add('opacity-0');
            } else {
                scrollInstruction.classList.remove('opacity-0');
            }
        }
    });
}

// Fonction pour initialiser l'effet machine à écrire
function initTypewriterEffect() {
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
}
