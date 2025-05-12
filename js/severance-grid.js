// Définir la classe avant de l'exposer globalement
class NumberGrid {
    constructor(gridSize = 20) {
        this.gridSize = gridSize;
        this.grid = [];
        this.noise = new SimplexNoise();
        this.badGroups = [];
        
        // Version simplifiée de la progression des bins
        this.bins = [0, 0, 0, 0, 0];
        this.binTargets = [100, 100, 100, 100, 100];
        this.activeGroup = null;
        this.lastUpdateTime = Date.now();
        
        // Réinitialiser complètement le localStorage pour partir sur des bases saines
        localStorage.removeItem('severanceBins');
        localStorage.removeItem('severanceProgress');
        
        // Initialiser
        this.initialize();
        this.setupEventListeners();
        this.startAnimationLoop();
    }
    
    // Méthode pour gérer les erreurs d'initialisation
    handleInitializationError() {
        const gridElement = document.getElementById('number-grid');
        if (gridElement) {
            gridElement.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #5dd8d9;">
                    <p>Erreur de chargement de la grille.</p>
                    <button onclick="location.reload()" style="background: #5dd8d9; color: black; border: none; padding: 8px 16px; margin-top: 10px; cursor: pointer;">
                        Réessayer
                    </button>
                </div>
            `;
        }
    }
    
    // Méthodes pour la gestion de l'état persistant
    saveState(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Erreur lors de la sauvegarde de ${key}:`, e);
        }
    }
    
    loadState(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error(`Erreur lors du chargement de ${key}:`, e);
            return null;
        }
    }
    
    initialize() {
        const gridElement = document.getElementById('number-grid');
        gridElement.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        
        // Generate grid numbers
        for (let y = 0; y < this.gridSize; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'number-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                const value = Math.floor(Math.random() * 10);
                cell.textContent = value;
                cell.dataset.value = value;
                
                gridElement.appendChild(cell);
                this.grid[y][x] = {
                    element: cell,
                    value: value,
                    isBad: false,
                    groupId: null,
                    offset: { x: 0, y: 0 }
                };
            }
        }
        
        // Generate bad groups using Perlin noise
        this.generateBadGroups();
        
        // Initialize highlight effect
        this.highlight = document.querySelector('.highlight');
        this.highlight.style.width = '300px';
        this.highlight.style.height = '300px';
        
        // Update the progress bars
        this.updateProgressBars();
    }
    
    initializeBins() {
        // Commencer avec des valeurs à 0 pour voir la progression depuis le début
        this.bins = [0, 0, 0, 0, 0];
        this.binTargets = [100, 100, 100, 100, 100];
        
        // Appliquer les valeurs initiales aux barres de progression
        this.updateProgressBars();
        this.calculateGlobalCompletion();
    }
    
    generateBadGroups() {
        // Map grid with Perlin noise to get natural groupings
        const noiseScale = 0.1;
        let groupId = 1;
        
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const noiseValue = this.noise.noise2D(x * noiseScale, y * noiseScale);
                // Values above threshold are "bad"
                if (noiseValue > 0.3) {
                    this.grid[y][x].isBad = true;
                    
                    // Find adjacent group or create new one
                    let foundGroupId = null;
                    
                    // Check neighbors for existing groups
                    const neighbors = [
                        {x: x-1, y: y},
                        {x: x, y: y-1}
                    ];
                    
                    for (const neighbor of neighbors) {
                        if (neighbor.x >= 0 && neighbor.y >= 0) {
                            const neighborCell = this.grid[neighbor.y][neighbor.x];
                            if (neighborCell.isBad && neighborCell.groupId !== null) {
                                foundGroupId = neighborCell.groupId;
                                break;
                            }
                        }
                    }
                    
                    // Assign to group or create new one
                    if (foundGroupId === null) {
                        foundGroupId = groupId++;
                        this.badGroups.push({
                            id: foundGroupId,
                            cells: [],
                            isActive: false,
                            isSuperActive: false,
                            activationTime: 0
                        });
                    }
                    
                    this.grid[y][x].groupId = foundGroupId;
                    
                    // Add to the group's cells
                    const group = this.badGroups.find(g => g.id === foundGroupId);
                    if (group) {
                        group.cells.push({x, y});
                    }
                }
            }
        }
        
        // Update styling for bad numbers
        for (const group of this.badGroups) {
            for (const cell of group.cells) {
                const gridCell = this.grid[cell.y][cell.x];
                gridCell.element.classList.add('bad');
            }
        }
        
        console.log(`Generated ${this.badGroups.length} bad groups`);
    }
    
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            const rect = document.querySelector('.grid-container').getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            
            // Update highlight position
            this.highlight.style.left = `${x}px`;
            this.highlight.style.top = `${y}px`;
            
            // Scale numbers based on proximity to cursor
            document.querySelectorAll('.number-cell').forEach(cell => {
                const cellRect = cell.getBoundingClientRect();
                const centerX = cellRect.left + cellRect.width / 2;
                const centerY = cellRect.top + cellRect.height / 2;
                
                const distance = Math.sqrt(
                    Math.pow(centerX - x, 2) + 
                    Math.pow(centerY - y, 2)
                );
                
                const maxDistance = 150;
                if (distance < maxDistance) {
                    const scale = 1 + (1 - distance / maxDistance) * 0.5;
                    cell.style.transform = `scale(${scale})`;
                    
                    // Check if cursor is hovering over active group
                    if (this.activeGroup) {
                        const cellX = parseInt(cell.dataset.x);
                        const cellY = parseInt(cell.dataset.y);
                        const isInActiveGroup = this.activeGroup.cells.some(
                            c => c.x === cellX && c.y === cellY
                        );
                        
                        if (isInActiveGroup) {
                            this.activeGroup.isSuperActive = true;
                            this.activeGroup.activationTime = 10; // reset timer
                            
                            // Update styling for super active group
                            this.updateGroupStyling(this.activeGroup);
                        }
                    }
                } else {
                    if (!cell.classList.contains('active') && 
                        !cell.classList.contains('super-active')) {
                        cell.style.transform = '';
                    }
                }
            });
        });
        
        // Handle clicks on numbers
        document.getElementById('number-grid').addEventListener('click', (e) => {
            if (e.target.classList.contains('number-cell')) {
                const x = parseInt(e.target.dataset.x);
                const y = parseInt(e.target.dataset.y);
                const cell = this.grid[y][x];
                
                if (cell.isBad && cell.groupId !== null) {
                    const group = this.badGroups.find(g => g.id === cell.groupId);
                    if (group && (group.isActive || group.isSuperActive)) {
                        this.refineGroup(group);
                    }
                }
            }
        });
    }
    
    startAnimationLoop() {
        // Activate groups randomly avec gestion d'erreur
        this.groupTimer = setInterval(() => {
            try {
                // Update active group timers
                if (this.activeGroup) {
                    this.activeGroup.activationTime--;
                    
                    if (this.activeGroup.activationTime <= 0) {
                        this.deactivateGroup(this.activeGroup);
                        this.activeGroup = null;
                    }
                }
                
                // Choose a new active group if none active
                if (!this.activeGroup && this.badGroups.length > 0) {
                    const randomIndex = Math.floor(Math.random() * this.badGroups.length);
                    this.activeGroup = this.badGroups[randomIndex];
                    this.activeGroup.isActive = true;
                    this.activeGroup.activationTime = 5; // seconds
                    
                    this.updateGroupStyling(this.activeGroup);
                    
                    // Update focus numbers display
                    const focusNumbers = [];
                    for (let i = 0; i < 3; i++) {
                        if (this.activeGroup.cells[i]) {
                            const cell = this.grid[this.activeGroup.cells[i].y][this.activeGroup.cells[i].x];
                            focusNumbers.push(cell.value);
                        } else {
                            focusNumbers.push(Math.floor(Math.random() * 10));
                        }
                    }
                    
                    document.getElementById('focus-number1').textContent = focusNumbers[0];
                    document.getElementById('focus-number2').textContent = focusNumbers[1];
                    document.getElementById('focus-number3').textContent = focusNumbers[2];
                    
                    // Display focus numbers briefly
                    const focusElement = document.querySelector('.focus-numbers');
                    focusElement.style.display = 'block';
                    setTimeout(() => {
                        focusElement.style.display = 'none';
                    }, 1000);
                }
            } catch (error) {
                console.error("Erreur dans la boucle d'animation des groupes:", error);
                // Éviter que le timer ne continue à causer des erreurs
                clearInterval(this.groupTimer);
            }
        }, 1000);
        
        // Animate number offsets with Perlin noise - version optimisée
        let time = 0;
        const animate = () => {
            try {
                time += 0.01;
                
                // Optimisation: ne pas animer tous les éléments à chaque frame
                // mais plutôt par lots pour réduire la charge CPU
                const animateBatch = (startY, endY) => {
                    for (let y = startY; y < endY && y < this.gridSize; y++) {
                        for (let x = 0; x < this.gridSize; x++) {
                            const cell = this.grid[y][x];
                            
                            // Skip refined cells
                            if (cell.element.classList.contains('refined')) continue;
                            
                            // Add slight noise-based movement with moins de calculs
                            const noiseX = this.noise.noise3D(x * 0.1, y * 0.1, time);
                            const noiseY = this.noise.noise3D(x * 0.1, y * 0.1, time + 100);
                            
                            // Réduire l'amplitude du mouvement pour plus de stabilité
                            const offsetX = noiseX * 1.5;
                            const offsetY = noiseY * 1.5;
                            
                            // Appliquer la transformation de base
                            let transform = `translate(${offsetX}px, ${offsetY}px)`;
                            
                            // Ajouter des mouvements supplémentaires uniquement pour les cellules actives
                            if (cell.groupId === this.activeGroup?.id && 
                                (this.activeGroup.isActive || this.activeGroup.isSuperActive)) {
                                const jitter = this.activeGroup.isSuperActive ? 2 : 0.8;
                                const extraX = (Math.random() - 0.5) * jitter;
                                const extraY = (Math.random() - 0.5) * jitter;
                                transform = `translate(${offsetX + extraX}px, ${offsetY + extraY}px)`;
                            }
                            
                            cell.element.style.transform = transform;
                        }
                    }
                };
                
                // Animer par lots pour meilleures performances
                const batchSize = 5; // 5 lignes à la fois
                for (let i = 0; i < this.gridSize; i += batchSize) {
                    animateBatch(i, i + batchSize);
                }
                
                this.animationFrameId = requestAnimationFrame(animate);
            } catch (error) {
                console.error("Erreur dans l'animation:", error);
                cancelAnimationFrame(this.animationFrameId);
                // Tenter de redémarrer l'animation après une pause
                setTimeout(() => {
                    this.animationFrameId = requestAnimationFrame(animate);
                }, 1000);
            }
        };
        
        this.animationFrameId = requestAnimationFrame(animate);
    }
    
    updateGroupStyling(group) {
        for (const cell of group.cells) {
            const gridCell = this.grid[cell.y][cell.x];
            
            gridCell.element.classList.remove('active', 'super-active');
            
            if (group.isSuperActive) {
                gridCell.element.classList.add('super-active');
            } else if (group.isActive) {
                gridCell.element.classList.add('active');
            }
        }
    }
    
    deactivateGroup(group) {
        group.isActive = false;
        group.isSuperActive = false;
        
        for (const cell of group.cells) {
            const gridCell = this.grid[cell.y][cell.x];
            gridCell.element.classList.remove('active', 'super-active');
        }
    }
    
    refineGroup(group) {
        // Assign to random bin
        const binIndex = Math.floor(Math.random() * 5);
        
        // Mark cells as refined
        for (const cell of group.cells) {
            const gridCell = this.grid[cell.y][cell.x];
            gridCell.element.classList.add('refined');
            gridCell.isBad = false;
        }
        
        // Remove from bad groups
        const index = this.badGroups.indexOf(group);
        if (index > -1) {
            this.badGroups.splice(index, 1);
        }
        
        if (this.activeGroup === group) {
            this.activeGroup = null;
        }
        
        // Utiliser un nombre fixe pour augmenter le bin - plus prévisible
        this.bins[binIndex] += 10; // Toujours augmenter de 10 points
        if (this.bins[binIndex] > this.binTargets[binIndex]) {
            this.bins[binIndex] = this.binTargets[binIndex];
        }
        
        // Sauvegarder l'heure du dernier raffinement
        this.lastUpdateTime = Date.now();
        
        // Mettre à jour les barres et pourcentage global
        this.updateProgressBars();
        this.calculateGlobalCompletion();
        
        // Animate cells moving to bin
        const binElement = document.querySelectorAll('.bin')[binIndex];
        const binRect = binElement.getBoundingClientRect();
        
        for (const cell of group.cells) {
            const gridCell = this.grid[cell.y][cell.x];
            const cellRect = gridCell.element.getBoundingClientRect();
            
            const translateX = binRect.left - cellRect.left + binRect.width/2 - cellRect.width/2;
            const translateY = binRect.top - cellRect.top + binRect.height/2 - cellRect.height/2;
            
            gridCell.element.style.transition = 'transform 1s ease, opacity 1s ease';
            gridCell.element.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.5)`;
            gridCell.element.style.opacity = '0';
            
            // Remove after animation
            setTimeout(() => {
                // Generate a new number in its place
                const value = Math.floor(Math.random() * 10);
                gridCell.element.textContent = value;
                gridCell.element.dataset.value = value;
                gridCell.value = value;
                gridCell.groupId = null;
                
                // Reset styling
                gridCell.element.style.transition = '';
                gridCell.element.style.transform = '';
                gridCell.element.style.opacity = '1';
                gridCell.element.classList.remove('refined', 'active', 'super-active');
            }, 1000);
        }
        
        // Mettre à jour le timestamp pour le watchdog
        this.lastAnimationTime = Date.now();
        
        // Augmenter le nombre de nouveaux groupes pour maintenir l'activité
        if (this.badGroups.length < 5 && Math.random() > 0.7) {
            this.generateAdditionalBadGroup();
        }
    }
    
    // Nouvelle méthode pour générer des groupes supplémentaires
    generateAdditionalBadGroup() {
        const groupSize = 3 + Math.floor(Math.random() * 5); // 3-7 cellules
        const availableCells = [];
        
        // Trouver des cellules disponibles
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (!this.grid[y][x].isBad && !this.grid[y][x].groupId) {
                    availableCells.push({x, y});
                }
            }
        }
        
        if (availableCells.length >= groupSize) {
            // Choisir des cellules aléatoires pour le nouveau groupe
            const shuffled = availableCells.sort(() => 0.5 - Math.random());
            const selectedCells = shuffled.slice(0, groupSize);
            
            // Créer un nouveau groupe
            const newGroupId = this.badGroups.length > 0 ? 
                Math.max(...this.badGroups.map(g => g.id)) + 1 : 1;
            
            const newGroup = {
                id: newGroupId,
                cells: selectedCells,
                isActive: false,
                isSuperActive: false,
                activationTime: 0
            };
            
            // Ajouter le groupe et mettre à jour les cellules
            this.badGroups.push(newGroup);
            
            for (const cell of selectedCells) {
                const gridCell = this.grid[cell.y][cell.x];
                gridCell.isBad = true;
                gridCell.groupId = newGroupId;
                gridCell.element.classList.add('bad');
            }
            
            console.log(`Nouveau groupe généré avec ${groupSize} cellules`);
        }
    }
    
    updateProgressBars() {
        const progressBars = document.querySelectorAll('.progress');
        
        for (let i = 0; i < 5; i++) {
            const percentage = (this.bins[i] / this.binTargets[i]) * 100;
            progressBars[i].style.width = `${percentage}%`;
            
            // Update bin text
            const bin = document.querySelectorAll('.bin')[i];
            if (bin) {
                bin.dataset.percentage = `${Math.floor(percentage)}%`;
            }
        }
        
        // Sauvegarder chaque fois que les barres sont mises à jour
        this.saveState('severanceBins', this.bins);
    }
    
    // Nouvelle méthode pour calculer le pourcentage global de complétion
    calculateGlobalCompletion() {
        let totalProgress = 0;
        let totalTarget = 0;
        
        for (let i = 0; i < 5; i++) {
            totalProgress += this.bins[i];
            totalTarget += this.binTargets[i];
        }
        
        const globalPercentage = totalTarget > 0 ? Math.round((totalProgress / totalTarget) * 100) : 0;
        
        // Mettre à jour l'affichage du pourcentage
        const percentageElement = document.getElementById('completion-percentage');
        if (percentageElement) {
            percentageElement.textContent = globalPercentage + '%';
            
            // Déverrouiller à partir de 60% au lieu de 80%
            if (globalPercentage >= 60) {
                localStorage.setItem('severanceGameCompleted', 'true');
            }
        }
        
        return globalPercentage;
    }
    
    // Ajouter une méthode pour réinitialiser les bins manuellement
    resetProgress() {
        this.bins = [0, 0, 0, 0, 0];
        this.saveState('severanceBins', this.bins);
        this.updateProgressBars();
        this.calculateGlobalCompletion();
    }
    
    // Ajouter une méthode de nettoyage pour éviter les fuites mémoire
    cleanup() {
        // Sauvegarder l'état avant de nettoyer
        this.saveBinsToStorage();
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        if (this.groupTimer) {
            clearInterval(this.groupTimer);
            this.groupTimer = null;
        }
        
        // Supprimer les écouteurs d'événements
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        const gridElement = document.getElementById('number-grid');
        if (gridElement) {
            gridElement.removeEventListener('click', this.clickHandler);
        }
    }
}

// Exposer la classe globalement après sa définition
window.NumberGrid = NumberGrid;

// Une seule instance de la grille
let gridInstance = null;

// Fonction globale pour récupérer l'instance active
window.getSeveranceGrid = function() {
    return gridInstance || window.severanceGridInstance;
};

// Ajouter une fonction pour préserver l'état en cas de rechargement
window.addEventListener('beforeunload', function() {
    // S'assurer que l'état est sauvegardé avant de quitter
    if (gridInstance) {
        gridInstance.saveState('severanceBins', gridInstance.bins);
    }
});

// Initialize on page load avec seulement l'essentiel
window.addEventListener('load', () => {
    // Créer une nouvelle instance
    const gridInstance = new NumberGrid();
    
    // Force l'initialisation du pourcentage à 0%
    if (document.getElementById('completion-percentage')) {
        document.getElementById('completion-percentage').textContent = '0%';
    }
});

// Ajouter un bouton de réinitialisation (optionnel, pour les tests)
// Ceci peut être ajouté au DOM pour réinitialiser manuellement la progression
window.resetSeveranceProgress = function() {
    if (gridInstance) {
        gridInstance.resetProgress();
    }
    return false; // Pour empêcher le comportement par défaut des liens
};
