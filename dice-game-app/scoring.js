// Scoring logic for Generał/Yahtzee

const CATEGORIES = {
    ONES: 'ones',
    TWOS: 'twos',
    THREES: 'threes',
    FOURS: 'fours',
    FIVES: 'fives',
    SIXES: 'sixes',
    THREE_OF_A_KIND: 'three',
    FOUR_OF_A_KIND: 'four',
    FULL: 'full',
    SMALL_STRAIGHT: 'ss',
    LARGE_STRAIGHT: 'ls',
    YAHTZEE: 'general',
    YAHTZEE_BONUS: 'general_bonus',
    CHANCE: 'chance'
};

const CATEGORY_ICONS = {
    ones: '⚀',
    twos: '⚁',
    threes: '⚂',
    fours: '⚃',
    fives: '⚄',
    sixes: '⚅',
    three: '3',
    four: '4',
    full: 'FH',
    ss: 'SS',
    ls: 'LS',
    general: 'G',
    general_bonus: 'GB',
    chance: 'CH'
};

const CATEGORY_NAMES = {
    ones: '1s',
    twos: '2s',
    threes: '3s',
    fours: '4s',
    fives: '5s',
    sixes: '6s',
    three: 'Three of a Kind',
    four: 'Four of a Kind',
    full: 'Full',
    ss: 'Small Straight',
    ls: 'Large Straight',
    general: 'Yatzy',
    general_bonus: 'Bonus',
    chance: 'Chance'
};

class ScoringEngine {
    // Count occurrences of each die value
    static countDice(dice) {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        dice.forEach(die => counts[die]++);
        return counts;
    }

    // Score upper section (1s through 6s)
    static scoreUpperSection(dice, dieValue) {
        const sum = dice.reduce((acc, die) => die === dieValue ? acc + die : acc, 0);
        return sum;
    }

    // Three of a kind - sum of all dice
    static isThreeOfAKind(dice) {
        const counts = this.countDice(dice);
        return Object.values(counts).some(count => count >= 3);
    }

    static scoreThreeOfAKind(dice) {
        if (!this.isThreeOfAKind(dice)) return null;
        return dice.reduce((a, b) => a + b, 0);
    }

    // Four of a kind - sum of all dice
    static isFourOfAKind(dice) {
        const counts = this.countDice(dice);
        return Object.values(counts).some(count => count >= 4);
    }

    static scoreFourOfAKind(dice) {
        if (!this.isFourOfAKind(dice)) return null;
        return dice.reduce((a, b) => a + b, 0);
    }

    // Full House - three of one, two of another
    static isFull(dice) {
        const counts = Object.values(this.countDice(dice)).sort((a, b) => b - a);
        return counts[0] === 3 && counts[1] === 2;
    }

    static scoreFull(dice) {
        return this.isFull(dice) ? 25 : null;
    }

    // Small Straight - 4 consecutive numbers
    static isSmallStraight(dice) {
        const sorted = [...new Set(dice)].sort((a, b) => a - b);
        const straights = [
            [1, 2, 3, 4],
            [2, 3, 4, 5],
            [3, 4, 5, 6]
        ];
        return straights.some(straight =>
            straight.every(num => sorted.includes(num))
        );
    }

    static scoreSmallStraight(dice) {
        return this.isSmallStraight(dice) ? 30 : null;
    }

    // Large Straight - 5 consecutive numbers
    static isLargeStraight(dice) {
        const sorted = [...new Set(dice)].sort((a, b) => a - b);
        const straights = [
            [1, 2, 3, 4, 5],
            [2, 3, 4, 5, 6]
        ];
        return straights.some(straight =>
            straight.every(num => sorted.includes(num))
        );
    }

    static scoreLargeStraight(dice) {
        return this.isLargeStraight(dice) ? 40 : null;
    }

    // Yahtzee - all 5 dice same
    static isYahtzee(dice) {
        const counts = this.countDice(dice);
        return Object.values(counts).some(count => count === 5);
    }

    static scoreYahtzee(dice) {
        return this.isYahtzee(dice) ? 50 : null;
    }

    // Chance - sum of all dice
    static scoreChance(dice) {
        return dice.reduce((a, b) => a + b, 0);
    }

    // Check if this is a Yahtzee bonus (Yahtzee rolled, primary general already used and scored)
    // A bonus only applies when the Yahtzee category has a positive score (not when it was filled with 0).
    static isYahtzeeBonus(dice, usedCategories) {
        return this.isYahtzee(dice) && usedCategories.general === 50;
    }

    // Get valid joker placement options for a Yahtzee bonus
    static getJokerOptions(dice, usedCategories) {
        // only offer joker options if a true Yahtzee has been counted for 50 points
        if (!this.isYahtzee(dice) || usedCategories.general !== 50) {
            return [];
        }

        const options = [];

        // Determine the value of the Yahtzee (5 matching dice)
        const counts = this.countDice(dice);
        const yahtzeeValue = Object.entries(counts).find(([_, count]) => count === 5)[0];

        // Check if matching upper category is empty
        const upperCategoryIndex = parseInt(yahtzeeValue) - 1;
        const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
        const matchingUpperCat = upperCategories[upperCategoryIndex];

        // First priority: if matching upper category is empty, offer it
        if (usedCategories[matchingUpperCat] === undefined) {
            const upperScore = this.scoreUpperSection(dice, parseInt(yahtzeeValue));
            options.push({
                category: matchingUpperCat,
                score: upperScore,
                icon: CATEGORY_ICONS[matchingUpperCat],
                isRequired: true,
                reasonKey: 'joker.mustFillMatching',
                reason: `Must fill matching upper category`
            });
            return options; // Only offer matching upper if it's available
        }

        // Second priority: offer any available lower categories as joker (with their standard point values)
        const lowerCategories = ['three', 'four', 'full', 'ss', 'ls', 'chance'];
        let hasLowerOption = false;

        lowerCategories.forEach(cat => {
            if (usedCategories[cat] === undefined) {
                let score = 0;
                const lowerCategoryValues = {
                    'three': 'sum',      // sum of all dice
                    'four': 'sum',       // sum of all dice
                    'full': 25,          // full house fixed value
                    'ss': 30,            // small straight fixed value
                    'ls': 40,            // large straight fixed value
                    'chance': 'sum'      // sum of all dice
                };

                const scoreType = lowerCategoryValues[cat];
                score = scoreType === 'sum' ? this.scoreChance(dice) : scoreType;

                options.push({
                    category: cat,
                    score: score,
                    icon: CATEGORY_ICONS[cat],
                    isRequired: false,
                    reasonKey: 'joker.jokerPlacement',
                    reason: 'Joker placement (as wildcard)',
                    bonus: 100
                });
                hasLowerOption = true;
            }
        });

        // If lower categories are all used, offer remaining upper categories (with 0 or matching points)
        if (!hasLowerOption) {
            upperCategories.forEach((cat, idx) => {
                if (usedCategories[cat] === undefined) {
                    const dieValue = idx + 1;
                    const score = dieValue === parseInt(yahtzeeValue)
                        ? this.scoreUpperSection(dice, dieValue)
                        : 0; // 0 if doesn't match

                    options.push({
                        category: cat,
                        score: score,
                        icon: CATEGORY_ICONS[cat],
                        isRequired: false,
                        reason: score === 0 ? 'Forced placement (0 pts)' : 'Matching upper category',
                        bonus: 100
                    });
                }
            });
        }

        return options;
    }

    // Get all valid combinations for given dice
    static getValidCombinations(dice, usedCategories) {
        const valid = [];

        // Upper section (1-6)
        for (let i = 1; i <= 6; i++) {
            const cat = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'][i - 1];
            if (!usedCategories[cat]) {
                const score = this.scoreUpperSection(dice, i);
                valid.push({ category: cat, score, icon: CATEGORY_ICONS[cat] });
            }
        }

        // Three of a kind
        if (!usedCategories.three && this.isThreeOfAKind(dice)) {
            valid.push({ category: 'three', score: this.scoreThreeOfAKind(dice), icon: '3' });
        }

        // Four of a kind
        if (!usedCategories.four && this.isFourOfAKind(dice)) {
            valid.push({ category: 'four', score: this.scoreFourOfAKind(dice), icon: '4' });
        }

        // Full
        if (!usedCategories.full && this.isFull(dice)) {
            valid.push({ category: 'full', score: 25, icon: 'Full' });
        }

        // Small Straight
        if (!usedCategories.ss && this.isSmallStraight(dice)) {
            valid.push({ category: 'ss', score: 30, icon: 'SS' });
        }

        // Large Straight
        if (!usedCategories.ls && this.isLargeStraight(dice)) {
            valid.push({ category: 'ls', score: 40, icon: 'LS' });
        }

        // Yahtzee (only if not already used)
        if (!usedCategories.general && this.isYahtzee(dice)) {
            valid.push({ category: 'general', score: 50, icon: '👑' });
        }

        // Chance (always available)
        if (!usedCategories.chance) {
            valid.push({ category: 'chance', score: this.scoreChance(dice), icon: 'Sum' });
        }

        return valid;
    }

    // Calculate total score for a player
    static calculateTotalScore(playerScores) {
        let upper = 0, lower = 0;
        const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];

        upperCategories.forEach(cat => {
            upper += playerScores[cat] || 0;
        });

        // Bonus for upper section >= 63
        let bonus = 0;
        if (upper >= 63) {
            bonus = 35;
        }

        const lowerCategories = ['three', 'four', 'full', 'ss', 'ls', 'general', 'general_bonus', 'chance'];
        lowerCategories.forEach(cat => {
            lower += playerScores[cat] || 0;
        });

        return upper + bonus + lower;
    }
}
