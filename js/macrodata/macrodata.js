// Variables globales pour le jeu
let g;
let shaderLayer, crtShader;
let useShader = false;
let columns = 15;
let dots = [];
let buckets = [];
let yLine;
let w;
let smaller;
let fullW;
let currentRefinementStage = 0;
let baseSize;
let file;
let gameCompleted = false;
let selectionStarted = false;
let gameStartTime;

// Palette de couleurs
const mobilePalette = {
  BG: '#010A13',
  FG: '#ABFFE9',
  SELECT: '#EEFFFF',
  LEVELS: {
    WO: '#05C3A8',
    FC: '#1EEFFF',
    DR: '#DF81D5',
    MA: '#F9ECBB',
  },
};

const shaderPalette = {
  BG: '#111111',
  FG: '#99f',
  SELECT: '#fff',
  LEVELS: {
    WO: '#17AC97',
    FC: '#4ABCC5',
    DR: '#B962B0',
    MA: '#D4BB5E',
  },
};

let palette = mobilePalette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  fullW = min(windowWidth, 1280);
  baseSize = 36;

  // Créer un buffer graphique pour le rendu
  g = createGraphics(windowWidth, windowHeight);
  
  // Nous ne voulons pas utiliser de shader sur mobile
  useShader = false; // !isTouchScreenDevice();
  
  // Forcer la densité de pixels à 1 pour améliorer les performances sur les écrans Retina
  pixelDensity(1);

  // Élément graphique p5 pour dessiner notre sortie de shader
  shaderLayer = createGraphics(g.width, g.height, WEBGL);
  shaderLayer.noStroke();

  smaller = min(g.width, g.height);
  gameStartTime = millis();

  // Initialiser le système de fichiers
  file = new MacrodataFile();
  
  // Mettre en place la ligne et la largeur
  yLine = g.height / 4;
  w = fullW / columns;
  
  // Initialiser les points et les bins
  for (let i = 0; i < columns; i++) {
    const x = (i * fullW) / columns + fullW / columns / 2;
    const y = yLine + w * 0.5;
    dots.push(new Dot(i, x, y, w * 0.5));
    buckets.push(new Bin(i % 4, file.storedBins[currentRefinementStage][['WO', 'FC', 'DR', 'MA'][i % 4]]));
  }
}

function keyPressed() {
  let keys = '1234567890qwertyuiopasdfghjklzxcvbnm'.split('');
  if (keys.includes(key.toLowerCase())) {
    let i = keys.indexOf(key) % columns;
    if (dots[i]) dots[i].go();
  }
}

// Gérer les interactions de la souris
function mousePressed() {
  // Vérifier si nous cliquons sur un point
  for (let i = 0; i < dots.length; i++) {
    if (dots[i] && dist(mouseX, mouseY, dots[i].x, dots[i].y) < dots[i].r) {
      dots[i].go();
      break;
    }
  }
}

function draw() {
  g.background(palette.BG);
  g.push();
  const diff = g.width - fullW;
  g.translate(diff / 2, 0);
  g.rectMode(CORNER);
  g.stroke(palette.FG);

  // Cadre
  g.strokeWeight(3);
  g.line(0, yLine, fullW, yLine);
  for (let i = 0; i < columns + 1; i++) {
    g.line(i * w, yLine, i * w, yLine + w * 1);
  }

  g.line(0, g.height - yLine * 0.25, fullW, g.height - yLine * 0.25);
  for (let i = 0; i < columns + 1; i++) {
    g.line(i * w, g.height - yLine * 0.25, i * w, g.height - yLine * 0.25 - w * 2);
  }

  // Barre supérieure
  const topBarTotal = 11;
  const topBarSpacing = fullW / topBarTotal;
  const y = yLine * 0.4;
  for (let i = 0; i < topBarTotal; i++) {
    const x = topBarSpacing * i + (i / topBarTotal) * (topBarSpacing - w);
    if (i == 0 || i > topBarTotal - 4) {
      g.noFill();
      g.strokeWeight(3);
      g.stroke(palette.FG);
      g.square(x, y, w);
    }
    if (i == 0) g.circle(x + w * 0.5, y + w * 0.5, w * 0.5);
    if (i == 1) {
      for (let j = 1; j < 5; j++) {
        g.ellipse(x + w * 0.5, y + j * w * 0.2, w * 0.75, w * 0.2);
      }
    }
    if (i == 2) {
      g.push();
      g.strokeWeight(w * 0.2);
      g.line(x + w * 0.25, y + w * 0.25, x + w * 0.75, y + w * 0.75);
      g.line(x + w * 0.75, y + w * 0.25, x + w * 0.25, y + w * 0.75);
      g.pop();
    }
    if (i == 3) {
      g.push();
      g.rectMode(CENTER);
      g.square(x + w * 0.5, y + w * 0.5, w * 0.75);
      g.pop();
    }
    if (i == 4) {
      for (let n = 0; n < 2; n++) {
        for (let m = 0; m < 2; m++) {
          g.rectMode(CORNER);
          g.square(x + w * 0.125 + n * w * 0.375, y + w * 0.125 + m * w * 0.375, w * 0.375);
        }
      }
    }
    if (i == 5) {
      for (let n = 0; n < 4; n++) {
        for (let m = 0; m < 4; m++) {
          g.rectMode(CORNER);
          g.square(x + w * 0.125 + n * w * 0.1875, y + w * 0.125 + m * w * 0.1875, w * 0.1875);
        }
      }
    }

    if (i == 8) {
      for (let j = 1; j < 4; j++) {
        g.line(x + w * 0.25, y + j * w * 0.25, x + w * 0.75, y + j * w * 0.25);
      }
    }
    if (i == 9) {
      g.fill(palette.FG);
      g.circle(x + w * 0.25, y + w * 0.25, w * 0.25);
      g.strokeWeight(w * 0.15);
      g.line(x + w * 0.25, y + w * 0.25, x + w * 0.75, y + w * 0.75);
    }
  }

  g.line(topBarSpacing, y, topBarSpacing * 8 - topBarSpacing / topBarTotal, y);
  g.line(topBarSpacing, y + w, topBarSpacing * 8 - topBarSpacing / topBarTotal, y + w);

  g.fill(palette.FG);
  g.noStroke();
  g.textSize(24);
  g.textAlign(CENTER, CENTER);
  g.text(`${file.fileName} - ${file.coordinates}`, fullW / 2, yLine * 0.25);

  // Mise à jour et affichage des points
  for (let i = columns - 1; i >= 0; i--) {
    if (!dots[i]) continue;
    dots[i].show();
    if (dots[i].update()) {
      buckets[i % 4].dots.push(dots[i]);
      dots[i] = null;
      for (let j = 0; j < columns; j++) {
        if (!dots[j] && buckets[j % 4].dots.length < 3 && random(1) < 0.25) {
          const x = (j * fullW) / columns + fullW / columns / 2;
          const y = yLine + w * 0.5;
          dots[j] = new Dot(j, x, y, w * 0.5);
        }
      }
    }
  }

  // Afficher les buckets
  for (let i = 0; i < 4; i++) {
    buckets[i].show();
    buckets[i].update();
  }

  g.pop();

  // Afficher les graphiques avec ou sans shader
  if (useShader) {
    shaderLayer.rect(0, 0, g.width, g.height);
    shaderLayer.shader(crtShader);

    // Passer l'image du contexte du canvas au shader en tant qu'uniforme
    crtShader.setUniform('u_tex', g);

    // Réinitialiser l'arrière-plan en noir pour vérifier que nous ne voyons pas la sortie de dessin d'origine
    background(palette.BG);
    imageMode(CORNER);
    image(shaderLayer, 0, 0, g.width, g.height);
  } else {
    image(g, 0, 0, g.width, g.height);
  }
}

class Dot {
  constructor(i, x, y, r) {
    this.i = i;
    this.x = x;
    this.y = y;
    this.r = r;
    this.going = false;
    this.speed = 20;
  }

  show() {
    g.stroke(palette.FG);
    g.strokeWeight(3);
    g.noFill();
    g.circle(this.x, this.y, this.r * 2);
    
    // Dessiner le chiffre à l'intérieur
    g.fill(palette.FG);
    g.noStroke();
    g.textAlign(CENTER, CENTER);
    g.textSize(this.r * 1.2);
    g.text(floor(random(10)), this.x, this.y);
  }

  update() {
    if (this.going) {
      this.y += this.speed;
      const total = buckets[this.i % 4].dots.length;
      const boundary = g.height - yLine * 0.25 - this.r * 0.8 - this.r * total * 1.25;
      if (this.y > boundary) {
        this.y = boundary;
        this.going = false;
        return true;
      }
    }
    return false;
  }

  go() {
    this.going = true;
  }
}

// Redimensionnement du canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  g = createGraphics(windowWidth, windowHeight);
  shaderLayer = createGraphics(g.width, g.height, WEBGL);
  shaderLayer.noStroke();
  
  fullW = min(windowWidth, 1280);
  smaller = min(g.width, g.height);
  yLine = g.height / 4;
  w = fullW / columns;
  
  // Repositionner les éléments
  for (let i = 0; i < columns; i++) {
    if (dots[i]) {
      const x = (i * fullW) / columns + fullW / columns / 2;
      const y = yLine + w * 0.5;
      dots[i].x = x;
      dots[i].y = y;
      dots[i].r = w * 0.5;
    }
  }
  
  // Repositionner les buckets
  for (let i = 0; i < 4; i++) {
    const margin = 80;
    const totalWidth = width - (margin * 2);
    const binWidth = totalWidth / 4;
    buckets[i].x = margin + (i * binWidth) + (binWidth / 2);
    buckets[i].y = height - 50;
  }
}
