class Bin {
  constructor(i, count) {
    this.i = i;
    this.dots = [];
    this.count = count;
    this.isOpen = false;
    this.openTime = 10;
    this.openCounter = 0;
    this.lastRefinedTime = 0;
    
    // Positionner les bins en bas
    const margin = 80;
    const totalWidth = width - (margin * 2);
    const binWidth = totalWidth / 4;
    this.x = margin + (i * binWidth) + (binWidth / 2);
    this.y = height - 50;
    this.label = ['WO', 'FC', 'DR', 'MA'][i];
    this.color = [palette.LEVELS.WO, palette.LEVELS.FC, palette.LEVELS.DR, palette.LEVELS.MA][i];
  }
  
  open() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.openCounter = this.openTime;
    }
    this.lastRefinedTime = millis();
  }
  
  update() {
    if (this.isOpen && this.openCounter > 0) {
      this.openCounter--;
    } else {
      this.isOpen = false;
    }
  }
  
  addNumber() {
    this.count++;
    file.storedBins[currentRefinementStage][this.label] = this.count;
    file.updateProgress(file.storedBins);
    
    // Si tous les bins atteignent au moins 5, le jeu est terminé
    let allBinsReady = true;
    for (let binKey of Object.keys(file.storedBins[currentRefinementStage])) {
      if (file.storedBins[currentRefinementStage][binKey] < 5) {
        allBinsReady = false;
        break;
      }
    }
    
    if (allBinsReady) {
      console.log("Tous les bins sont remplis!");
      currentRefinementStage++;
      
      // Si tous les stages sont terminés
      if (currentRefinementStage >= file.storedBins.length) {
        console.log("Raffinement terminé!");
        gameCompleted = true;
        showCompletionScreen();
      }
    }
  }
  
  show() {
    push();
    
    // Afficher le dossier/conteneur
    rectMode(CENTER);
    stroke(this.color);
    strokeWeight(2);
    noFill();
    
    if (this.isOpen || millis() - this.lastRefinedTime < 2000) {
      // Effet d'ouverture du bin
      rect(this.x, this.y, 60 + (this.openCounter * 2), 80);
    } else {
      rect(this.x, this.y, 60, 80);
    }
    
    // Afficher le libellé et le nombre
    fill(this.color);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y - 20);
    
    textSize(24);
    text(this.count, this.x, this.y + 10);
    pop();
  }
}
