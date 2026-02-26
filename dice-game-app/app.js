// Main application logic

class DiceGameApp {
    constructor() {
        this.appContainer = document.getElementById('app');

        // Game state
        this.gameState = {
            players: [],
            currentPlayerIndex: 0,
            currentRound: 1,
            gameFinished: false,
            pendingYahtzeeBonus: null
        };

        this.init();
    }

    init() {
        this.showWelcomeScreen();
    }

    // Screen: Welcome
    showWelcomeScreen() {
        const template = document.getElementById('screen-welcome');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        this.appContainer.querySelector('#welcome-start').addEventListener('click', () => {
            this.showPlayerSetupScreen();
        });
    }

    // Screen: Player Setup (merged count + names)
    showPlayerSetupScreen() {
        const template = document.getElementById('screen-player-setup');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        // Elements
        const playerBtns = this.appContainer.querySelectorAll('.player-btn');
        const playerInputsContainer = this.appContainer.querySelector('#player-inputs');
        const startBtn = this.appContainer.querySelector('#start-game');

        // Default: select 2 players
        playerBtns.forEach(b => b.classList.remove('active'));
        const defaultBtn = Array.from(playerBtns).find(b => b.dataset.players === '2');
        if (defaultBtn) defaultBtn.classList.add('active');

        // Initialize gameState players to 2 default names
        const defaultCount = 2;
        this.gameState.players = Array(defaultCount).fill(null).map((_, i) => ({
            name: `Player ${i + 1}`,
            scores: {}
        }));

        // Render name inputs for current selection
        const renderNameInputs = (count) => {
            playerInputsContainer.innerHTML = '';
            for (let i = 0; i < count; i++) {
                const group = document.createElement('div');
                group.className = 'player-input-group';
                group.innerHTML = `
                    <label>Player ${i + 1} Name</label>
                    <input type="text" placeholder="Enter name" value="${this.gameState.players[i] ? this.gameState.players[i].name : `Player ${i+1}`}" data-player-index="${i}">
                `;
                playerInputsContainer.appendChild(group);
            }

            const inputs = this.appContainer.querySelectorAll('[data-player-index]');
            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    const idx = parseInt(e.target.dataset.playerIndex);
                    this.gameState.players[idx].name = e.target.value;
                    this.updateContinueButton(startBtn, inputs);
                });
            });

            // Initial check
            this.updateContinueButton(startBtn, this.appContainer.querySelectorAll('[data-player-index]'));
        };

        // initial render for 2 players
        renderNameInputs(defaultCount);

        // Buttons behavior
        playerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                playerBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const count = parseInt(e.target.dataset.players);

                // adjust gameState players array
                const newPlayers = Array(count).fill(null).map((_, i) => ({
                    name: (this.gameState.players[i] && this.gameState.players[i].name) ? this.gameState.players[i].name : `Player ${i+1}`,
                    scores: (this.gameState.players[i] && this.gameState.players[i].scores) ? this.gameState.players[i].scores : {}
                }));
                this.gameState.players = newPlayers;

                renderNameInputs(count);
            });
        });

        startBtn.addEventListener('click', () => {
            this.gameState.currentPlayerIndex = 0;
            this.gameState.currentRound = 1;
            this.showScorecardScreen();
        });
    }

    updateContinueButton(btn, inputs) {
        const allFilled = Array.from(inputs).every(input => input.value.trim().length > 0);
        btn.disabled = !allFilled;
    }

    // Screen 3: Scorecard Preview
    showScorecardScreen() {
        const template = document.getElementById('screen-scorecard');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        const player = this.gameState.players[this.gameState.currentPlayerIndex];
        this.appContainer.querySelector('#player-name').textContent = `${player.name}'s Scorecard`;
        this.appContainer.querySelector('#round-info').textContent = `Round ${this.gameState.currentRound}`;

        this.renderScorecard();

        this.appContainer.querySelector('#proceed-to-dice').addEventListener('click', () => {
            this.showGameplayScreen();
        });
    }

    renderScorecard() {
        const player = this.gameState.players[this.gameState.currentPlayerIndex];
        const tableCont = this.appContainer.querySelector('#scorecard-table');
        tableCont.innerHTML = '';

        // Upper section
        const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
        let upperSum = 0;

        upperCategories.forEach((cat, idx) => {
            const score = player.scores[cat];
            const isUsed = score !== undefined;
            upperSum += score || 0;

            const row = document.createElement('div');
            row.className = 'scorecard-row ' + (isUsed ? 'used' : 'available');

            const dots = this.getDiceDots(idx + 1);

            // Only show icon and value (no label)
            row.innerHTML = `
                <div class="scorecard-icon">${dots}</div>
                <div class="scorecard-value">${isUsed ? score : '-'}</div>
            `;
            tableCont.appendChild(row);
        });

        // Bonus (upper section)
        const bonusValue = upperSum >= 63 ? 35 : 0;
        const bonusRow = document.createElement('div');
        bonusRow.className = 'scorecard-row';
        bonusRow.style.backgroundColor = '#314158';
        bonusRow.innerHTML = `
            <div class="scorecard-icon crown-icon">Bonus</div>
            <div class="scorecard-value">${bonusValue}</div>
        `;
        tableCont.appendChild(bonusRow);

        // Upper subtotal (includes bonus)
        const upperTotalRow = document.createElement('div');
        upperTotalRow.className = 'scorecard-row mb-3';
        upperTotalRow.innerHTML = `
            <div class="scorecard-icon crown-icon">Upper Sum</div>
            <div class="scorecard-value">${upperSum + bonusValue}</div>
        `;
        tableCont.appendChild(upperTotalRow);

        // Lower section

        // Lower section
        const lowerCategories = ['three', 'four', 'full', 'ss', 'ls', 'general', 'chance'];
        let lowerSum = 0;

        lowerCategories.forEach((cat) => {
            const score = player.scores[cat];
            const isUsed = score !== undefined;
            lowerSum += score || 0;

            const row = document.createElement('div');
            row.className = 'scorecard-row ' + (isUsed ? 'used' : 'available');

            // const label = CATEGORY_NAMES[cat] || cat;
            const icon = cat === 'general' || cat === 'general_bonus' ? 'Yahtzee' : CATEGORY_NAMES[cat];

            // show icon and value only
            row.innerHTML = `
                <div class="scorecard-icon">${icon}</div>
                <div class="scorecard-value">${isUsed ? score : '-'}</div>
            `;
            tableCont.appendChild(row);
        });

        // Lower bonus (e.g., additional Yahtzee/general bonus) - only show if > 0
        const lowerBonus = player.scores['general_bonus'] || 0;
        if (lowerBonus > 0) {
            const bonusRowLower = document.createElement('div');
            bonusRowLower.className = 'scorecard-row';
            bonusRowLower.style.backgroundColor = '#314158';
            bonusRowLower.innerHTML = `
                <div class="scorecard-icon crown-icon">Yahtzee Bonus</div>
                <div class="scorecard-value">${lowerBonus}</div>
            `;
            tableCont.appendChild(bonusRowLower);
        }

        // Lower subtotal (bottom total)
        const lowerTotal = lowerSum + lowerBonus;
        const lowerTotalRow = document.createElement('div');
        lowerTotalRow.className = 'scorecard-row';
        lowerTotalRow.innerHTML = `
            <div class="scorecard-icon crown-icon">Lower Sum</div>
            <div class="scorecard-value">${lowerTotal}</div>
        `;
        tableCont.appendChild(lowerTotalRow);

        // Grand Sum row (final)
        const grandTotal = (upperSum + bonusValue) + lowerTotal;
        const sumRow = document.createElement('div');
        sumRow.className = 'scorecard-row';
        sumRow.style.fontWeight = 'bold';
        sumRow.innerHTML = `
            <div class="scorecard-icon crown-icon">Sum</div>
            <div class="scorecard-value" style="color: var(--orange);">${grandTotal}</div>
        `;
        tableCont.appendChild(sumRow);
    }

    getDiceDots(num) {
        const patterns = {
            1: [[1, 1]],
            2: [[0, 0], [2, 2]],
            3: [[0, 0], [1, 1], [2, 2]],
            4: [[0, 0], [0, 2], [2, 0], [2, 2]],
            5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
            6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]]
        };

        let html = '<div class="dice-dots">';
        for (let i = 0; i < 9; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const hasDot = patterns[num].some(p => p[0] === row && p[1] === col);
            html += `<div class="dice-dot" style="${hasDot ? '' : 'opacity: 0;'}"></div>`;
        }
        html += '</div>';
        return html;
    }

    showGameplayScreen() {
        const template = document.getElementById('screen-gameplay');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        const player = this.gameState.players[this.gameState.currentPlayerIndex];
        this.appContainer.querySelector('#gameplay-player-name').textContent = player.name;
        this.appContainer.querySelector('#gameplay-round-info').textContent = `Round ${this.gameState.currentRound}`;

        let selectedDice = [];
        const continueBtn = this.appContainer.querySelector('#save-round');

        // Render dice grid
        const diceGrid = this.appContainer.querySelector('#dice-grid');
        for (let row = 0; row < 5; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.style.display = 'contents';

            for (let die = 1; die <= 6; die++) {
                const btn = document.createElement('button');
                btn.className = 'dice-button';
                btn.dataset.row = row;
                btn.dataset.die = die;

                const dots = this.getDiceDots(die);
                btn.innerHTML = dots;

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const rowNum = parseInt(btn.dataset.row);
                    const dieVal = parseInt(btn.dataset.die);

                    // Remove previous selection in this row
                    const prevSelected = diceGrid.querySelector(`[data-row="${rowNum}"].selected`);
                    if (prevSelected) {
                        prevSelected.classList.remove('selected');
                    }

                    btn.classList.add('selected');
                    selectedDice[rowNum] = dieVal;

                    // Update combinations
                    this.updateCombinations(selectedDice, continueBtn);
                });

                rowDiv.appendChild(btn);
            }
            diceGrid.appendChild(rowDiv);
        }

        continueBtn.addEventListener('click', () => {
            const selected = Object.values(selectedDice).filter(d => d !== undefined);
            if (selected.length < 5) {
                alert('Please select all 5 dice');
                return;
            }

            const player = this.gameState.players[this.gameState.currentPlayerIndex];

            // Apply the selected combination to scores (only if one was selected)
            if (this.gameState.selectedCombo) {
                player.scores[this.gameState.selectedCombo.category] = this.gameState.selectedCombo.score;
                this.gameState.selectedCombo = null;
            }

            // Advance to next player or round
            this.gameState.currentPlayerIndex++;
            if (this.gameState.currentPlayerIndex >= this.gameState.players.length) {
                this.gameState.currentPlayerIndex = 0;
                this.gameState.currentRound++;

                if (this.gameState.currentRound > 13) {
                    this.showResultsScreen();
                    return;
                }
            }

            this.showScorecardScreen();
        });
    }

    updateCombinations(selectedDice, continueBtn) {
        const selected = Object.values(selectedDice).filter(d => d !== undefined);
        const comboList = this.appContainer.querySelector('#combinations-list');
        comboList.innerHTML = '';

        if (selected.length < 5) {
            continueBtn.disabled = true;
            return;
        }

        const player = this.gameState.players[this.gameState.currentPlayerIndex];

        // Check if this is a Yahtzee bonus BEFORE showing combinations
        if (ScoringEngine.isYahtzeeBonus(selected, player.scores)) {
            // Store dice for joker placement
            this.gameState.pendingYahtzeeBonus = {
                dice: selected,
                playerIndex: this.gameState.currentPlayerIndex
            };
            // Show joker screen instead of combinations
            this.showJokerSelectionScreen();
            return;
        }

        const validCombinations = ScoringEngine.getValidCombinations(selected, player.scores);

        // Build a map of valid combinations for quick lookup
        const validComboMap = {};
        validCombinations.forEach(combo => {
            validComboMap[combo.category] = combo;
        });

        // Get all categories that haven't been used yet
        const allCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
                               'three', 'four', 'full', 'ss', 'ls', 'general', 'chance'];

        // Build complete list: valid combos first, then unused categories with 0 points
        const categoriesToShow = allCategories
            .filter(cat => player.scores[cat] === undefined)
            .map(cat => {
                // If this category has a valid combo, use it; otherwise create a 0-point option
                if (validComboMap[cat]) {
                    return validComboMap[cat];
                } else {
                    return {
                        category: cat,
                        score: 0,
                        icon: CATEGORY_ICONS[cat] || cat,
                        isZero: true  // Mark as forcing 0 points
                    };
                }
            });

        if (categoriesToShow.length === 0) {
            this.appContainer.querySelector('#combinations-title').textContent = 'All categories filled';
            continueBtn.disabled = true;
            return;
        }

        this.appContainer.querySelector('#combinations-title').textContent = 'Available options';
        continueBtn.disabled = true;

        categoriesToShow.forEach((combo) => {
            const item = document.createElement('div');
            item.className = 'combination-item' + (combo.score === 0 ? ' zero-placement' : '');

            const btn = document.createElement('button');
            btn.className = 'combination-btn';
            btn.textContent = 'Select';

            btn.addEventListener('click', () => {
                // Remove selected class from all buttons
                comboList.querySelectorAll('.combination-btn').forEach(b => {
                    b.classList.remove('selected');
                });
                // Add selected class to clicked button
                btn.classList.add('selected');

                // Store the selected combo in gameState (don't add to scores yet)
                this.gameState.selectedCombo = combo;
                continueBtn.disabled = false;
            });

            item.innerHTML = `
                <div class="combination-label">${CATEGORY_NAMES[combo.category] || combo.category}</div>
                <div class="combination-score" ${combo.isZero ? '' : ''}>${combo.score}</div>
            `;
            item.appendChild(btn);
            comboList.appendChild(item);
        });

        // Initialize selectedCombo to null when combinations are rendered
        this.gameState.selectedCombo = null;
    }

    // Screen: Joker Selection (Yahtzee Bonus)
    showJokerSelectionScreen() {
        const template = document.getElementById('screen-joker-selection');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        const player = this.gameState.players[this.gameState.currentPlayerIndex];
        this.appContainer.querySelector('#joker-player-name').textContent = player.name;
        this.appContainer.querySelector('#joker-round-info').textContent = `Round ${this.gameState.currentRound}`;

        const dice = this.gameState.pendingYahtzeeBonus.dice;
        let selectedJokerCategory = null;

        // Get bonus value (check if already has general_bonus to add +100 more)
        const currentBonus = player.scores['general_bonus'] || 0;
        const newBonus = currentBonus + 100;
        this.appContainer.querySelector('#joker-bonus-text').innerHTML =
            `Bonus: +100 points <br><small>(Total bonus: ${newBonus} pts)</small>`;

        // Get valid joker options
        const jokerOptions = ScoringEngine.getJokerOptions(dice, player.scores);
        const optionsList = this.appContainer.querySelector('#joker-options-list');
        const confirmBtn = this.appContainer.querySelector('#joker-confirm');

        if (jokerOptions.length === 0) {
            optionsList.innerHTML = '<p style="color: var(--orange);">No valid placement options available</p>';
            return;
        }

        // Render options
        jokerOptions.forEach((option) => {
            const item = document.createElement('div');
            item.className = 'combination-item joker-option';

            const btn = document.createElement('button');
            btn.className = 'combination-btn';
            btn.textContent = 'Select';

            btn.addEventListener('click', () => {
                // Remove previous selection
                optionsList.querySelectorAll('.combination-btn').forEach(b => {
                    b.classList.remove('selected');
                });
                btn.classList.add('selected');
                selectedJokerCategory = option;
                confirmBtn.disabled = false;
            });

            item.innerHTML = `
                <div class="combination-label" style="flex: 1;">
                    <div>${CATEGORY_NAMES[option.category] || option.category}</div>
                    <small style="color: var(--slate-600);">${option.reason}</small>
                </div>
                <div class="combination-score">${option.score}</div>
            `;
            item.appendChild(btn);
            optionsList.appendChild(item);
        });

        confirmBtn.addEventListener('click', () => {
            if (!selectedJokerCategory) {
                alert('Please select a placement category');
                return;
            }

            // Apply the scores
            player.scores[selectedJokerCategory.category] = selectedJokerCategory.score;
            player.scores['general_bonus'] = (player.scores['general_bonus'] || 0) + 100;

            // Clear pending Yahtzee bonus
            this.gameState.pendingYahtzeeBonus = null;

            // Advance to next player or round
            this.gameState.currentPlayerIndex++;
            if (this.gameState.currentPlayerIndex >= this.gameState.players.length) {
                this.gameState.currentPlayerIndex = 0;
                this.gameState.currentRound++;

                if (this.gameState.currentRound > 13) {
                    this.showResultsScreen();
                    return;
                }
            }

            this.showScorecardScreen();
        });
    }

    // Screen 6: Results
    showResultsScreen() {
        const template = document.getElementById('screen-results');
        const screen = template.content.cloneNode(true);

        this.appContainer.innerHTML = '';
        this.appContainer.appendChild(screen);

        const resultsTable = this.appContainer.querySelector('#results-table');

        const sorted = this.gameState.players
            .map((p, idx) => ({
                name: p.name,
                score: ScoringEngine.calculateTotalScore(p.scores),
                scoreDetails: p.scores,
                originalIndex: idx
            }))
            .sort((a, b) => b.score - a.score);

        sorted.forEach((result, idx) => {
            const item = document.createElement('div');
            item.className = 'result-accordion';

            // Header (clickable)
            const header = document.createElement('div');
            header.className = 'result-item result-item-clickable';
            header.innerHTML = `
                <div class="result-name">${idx + 1}. ${result.name}</div>
                <div class="result-score">${result.score}</div>
                <div class="accordion-arrow">▼</div>
            `;

            // Details (hidden by default)
            const details = document.createElement('div');
            details.className = 'result-details';
            details.innerHTML = this.buildDetailedScorecard(result.scoreDetails);

            // Toggle accordion
            header.addEventListener('click', () => {
                details.classList.toggle('expanded');
                header.classList.toggle('expanded');
            });

            item.appendChild(header);
            item.appendChild(details);
            resultsTable.appendChild(item);
        });

        this.appContainer.querySelector('#new-game').addEventListener('click', () => {
            this.gameState = {
                players: [],
                currentPlayerIndex: 0,
                currentRound: 1,
                gameFinished: false,
                pendingYahtzeeBonus: null
            };
            this.showPlayerSetupScreen();
        });
    }

    // Build detailed scorecard HTML
    buildDetailedScorecard(scores) {
        let html = '<div class="score-breakdown">';

        // Upper section
        const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
        let upperSum = 0;
        html += '<div class="score-section"><h4>Upper</h4>';

        upperCategories.forEach((cat) => {
            const score = scores[cat] ?? '-';
            if (score !== '-') upperSum += score;
            html += `<div class="score-row"><span>${CATEGORY_NAMES[cat]}</span><span>${score}</span></div>`;
        });

        html += `<div class="score-row"><span>Upper Sum</span><span>${upperSum}</span></div>`;

        // Upper bonus
        const upperBonus = upperSum >= 63 ? 35 : 0;
        html += `<div class="score-row"><span>Upper Bonus</span><span>${upperBonus}</span></div>`;
        html += `<div class="score-row score-total"><span>Upper Total</span><span>${upperSum + upperBonus}</span></div>`;
        html += '</div>';

        // Lower section
        const lowerCategories = ['three', 'four', 'full', 'ss', 'ls', 'general', 'general_bonus', 'chance'];
        let lowerSum = 0;
        html += '<div class="score-section"><h4>Lower</h4>';

        lowerCategories.forEach((cat) => {
            const score = scores[cat] ?? '-';
            if (score !== '-') lowerSum += score;
            html += `<div class="score-row"><span>${CATEGORY_NAMES[cat]}</span><span>${score}</span></div>`;
        });

        html += `<div class="score-row score-total"><span>Lower Total</span><span>${lowerSum}</span></div>`;
        html += '</div>';

        // Grand total
        const grandTotal = (upperSum + upperBonus) + lowerSum;
        html += `<div class="score-section"><div class="score-row score-grand-total"><span>Grand Total</span><span>${grandTotal}</span></div></div>`;

        html += '</div>';
        return html;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new DiceGameApp();
});
