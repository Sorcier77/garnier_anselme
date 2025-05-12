// Easter egg pour le jeu Severance - détecter la séquence "mdr"
let easterEggBuffer = '';
const easterEggCode = 'mdr';

document.addEventListener('keydown', function(event) {
    // Ajouter la touche au buffer
    easterEggBuffer += event.key.toLowerCase();
    
    // Garder seulement les derniers caractères correspondant à la longueur du code
    if (easterEggBuffer.length > easterEggCode.length) {
        easterEggBuffer = easterEggBuffer.substring(easterEggBuffer.length - easterEggCode.length);
    }
    
    // Vérifier si le buffer correspond au code
    if (easterEggBuffer === easterEggCode) {
        // Animation ou effet visuel
        const flashOverlay = document.createElement('div');
        flashOverlay.style.position = 'fixed';
        flashOverlay.style.inset = '0';
        flashOverlay.style.backgroundColor = 'white';
        flashOverlay.style.opacity = '0';
        flashOverlay.style.zIndex = '9999';
        flashOverlay.style.transition = 'opacity 0.5s ease-in-out';
        document.body.appendChild(flashOverlay);
        
        // Flash d'écran
        setTimeout(() => {
            flashOverlay.style.opacity = '1';
            setTimeout(() => {
                flashOverlay.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(flashOverlay);
                    // Rediriger vers la page du jeu
                    window.location.href = "severance.html";
                }, 500);
            }, 200);
        }, 100);
        
        // Réinitialiser le buffer
        easterEggBuffer = '';
    }
});
