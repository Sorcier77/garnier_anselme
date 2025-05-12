// Liste des noms de fichiers pour les données MDR
const files = [
  'Siena',
  'Nanning',
  'Narva',
  'Ocula',
  'Kingsport',
  'Labrador',
  'Le Mars',
  'Longbranch',
  'Moonbeam',
  'Minsk',
  'Dranesville',
];

const emptyBins = [
  {WO: 0, FC: 0, DR: 0, MA: 0},
  {WO: 0, FC: 0, DR: 0, MA: 0},
  {WO: 0, FC: 0, DR: 0, MA: 0},
  {WO: 0, FC: 0, DR: 0, MA: 0},
  {WO: 0, FC: 0, DR: 0, MA: 0}
];

class MacrodataFile {
  constructor() {
    this.localStorageKey = 'macrodata';
    const file = JSON.parse(localStorage.getItem(this.localStorageKey)) ?? this.assignFile();
    this.fileName = file.fileName;
    this.storedBins = file.storedBins;
    this.coordinates = file.coordinates;
  }

  assignFile() {
    // quick fix to ensure you don't get the same filename twice in a row
    const allFilesButPrevious = files.filter(file => file !== this.fileName);
    const fileName = allFilesButPrevious[Math.floor(Math.random() * allFilesButPrevious.length)];
    const coordinates = this.#generateCoordinates();
    console.log('assigning', fileName);
    const macrodata = {
      fileName,
      storedBins: emptyBins,
      coordinates
    }
    localStorage.setItem(this.localStorageKey, JSON.stringify(macrodata));
    return macrodata;
  }

  updateProgress(bins) {
    const updatedFile = {
      fileName: this.fileName,
      storedBins: bins,
      coordinates: this.coordinates
    }
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedFile));
  }

  resetFile() {
    localStorage.removeItem(this.localStorageKey);
    const file = this.assignFile();
    this.fileName = file.fileName;
    this.storedBins = file.storedBins;
    this.coordinates = file.coordinates;
  }

  // Fonction privée pour générer des coordonnées
  #generateCoordinates() {
    function randHex() {
      return Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0');
    }
    let x = randHex() + randHex() + randHex();
    let y = randHex() + randHex() + randHex();
    
    return `0x${x} : 0x${y}`;
  }
}

// Fonction suggérée par MDN pour détecter les appareils tactiles
const isTouchScreenDevice = () => {
  let hasTouchScreen = false;
  if ("maxTouchPoints" in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    const mQ = window.matchMedia && matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
      hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
      hasTouchScreen = true; // deprecated, but good fallback
    } else {
      // Only as a last resort, fall back to user agent sniffing
      const UA = navigator.userAgent;
      hasTouchScreen = (
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
      );
    }
  }
  return hasTouchScreen;
}

// Convertit des secondes en chaîne de caractères hh:mm:ss:ms
const createTimeString = (seconds) => {
  const baseString = new Date(seconds * 1000).toISOString().substring(11, 23);
  const hhmm = baseString.split(':');
  const ssms = hhmm[2].split('.');
  return `${hhmm[0]}h ${hhmm[1]}m ${ssms[0]}s ${ssms[1].substring(0, 2)}ms`;
}

// Affiche l'écran de complétion
function showCompletionScreen() {
  // Récupérer l'instance de fichier
  const macrodataFile = new MacrodataFile();
  
  // Créer l'écran de complétion s'il n'existe pas
  if (!document.querySelector('.completion-screen')) {
    const completionScreen = document.createElement('div');
    completionScreen.className = 'completion-screen';
    completionScreen.innerHTML = `
      <div class="completion-content">
        <h2 class="completion-title">RAFFINEMENT TERMINÉ</h2>
        <p class="completion-message">
          Félicitations. Vous avez terminé avec succès votre tâche de raffinement de données.
          <br><br>
          Données traitées : ${macrodataFile.fileName}
          <br>
          Coordonnées : ${macrodataFile.coordinates}
          <br><br>
          ACCÈS AU PROFIL EMPLOYÉ ACCORDÉ
        </p>
        <button class="completion-button">CONTINUER</button>
      </div>
    `;
    document.body.appendChild(completionScreen);
    
    // Ajouter l'écouteur d'événement pour le bouton
    document.querySelector('.completion-button').addEventListener('click', function() {
      if (window.onGameComplete) {
        window.onGameComplete();
      } else {
        window.location.href = "severance-cv.html";
      }
    });
  }
  
  // Afficher l'écran
  setTimeout(() => {
    document.querySelector('.completion-screen').classList.add('visible');
  }, 500);
}
