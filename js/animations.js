/**
 * Animations et effets de défilement
 */

document.addEventListener('DOMContentLoaded', function() {
    // Animations au défilement
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
    
    // Animations de la barre de navigation
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
    });
    
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

/**
 * Anime un texte avec un effet de machine à écrire
 * @param {Element} element - L'élément dans lequel écrire
 * @param {string} text - Le texte à écrire
 * @param {number} speed - La vitesse d'écriture (ms)
 * @param {Function} callback - Fonction appelée après l'animation
 */
function typeWriter(element, text, speed, callback) {
    let i = 0;
    function typing() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        } else if (callback) {
            callback();
        }
    }
    element.textContent = ''; // Vider le texte initial
    typing();
}
