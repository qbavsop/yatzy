# Yatzy - Dice Game Score Tracker

A Progressive Web App (PWA) for tracking and calculating scores for the Generał (Yatzy) dice game played with physical dice.

## Features

✅ Support for 2-5 players
✅ 13-round gameplay (standard rules)
✅ Automatic validation of scoring combinations
✅ Real dice dot patterns visualization
✅ Offline-first PWA (works without internet)
✅ Installable on Android & iOS devices
✅ Color-coded interface (slate & orange theme)

## How to Run

### Option 1: Local HTTP Server (Python)
```bash
cd d:\dices\dice-game-app
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

### Option 2: Node.js Simple Server
```bash
cd d:\dices\dice-game-app
npx http-server
```

### Option 3: Direct File (Limited functionality)
Simply open `index.html` in a modern browser. Note: Service Worker requires HTTPS or localhost.

## Installation as PWA

1. **Android**: Open in Chrome → Menu → "Install app" or "Add to Home screen"
2. **iOS**: Open in Safari → Share → "Add to Home Screen"
3. **Desktop (Chrome)**: URL bar → Install icon

## Game Rules

- **13 Rounds** per game
- **5 Dice** per player per round
- **Upper Section** (1s-6s): Sum of matching dice values
  - **Bonus**: +35 points if total ≥ 63
- **Lower Section**:
  - Three of a Kind: Sum of all dice
  - Four of a Kind: Sum of all dice
  - Full House: 25 points
  - Small Straight: 30 points (4 consecutive)
  - Large Straight: 40 points (5 consecutive)
  - Yatzy: 50 points (all 5 same)
  - Chance: Sum of all dice

## File Structure

```
dice-game-app/
├── index.html          # Main HTML
├── style.css           # Styling (colors: slate-800/700/600, orange)
├── app.js              # Main app logic & screen rendering
├── scoring.js          # Scoring engine & combination validation
├── sw.js               # Service Worker (offline support)
├── manifest.json       # PWA metadata
└── README.md           # This file
```

## Colors

- **Slate-800**: #1D293D (main background)
- **Slate-700**: #314158 (bonus fields)
- **Slate-600**: #45556C (inactive/secondary)
- **Orange**: #FF8102 (active/selected)
- **White**: #FFFFFF (text)

## Development

### Technologies
- Vanilla JavaScript (no frameworks)
- PWA & Service Worker API
- CSS Grid & Flexbox
- localStorage ready for persistence

### Future Enhancements
- Save games to localStorage
- Export scores to CSV
- Multiplayer online (WebSockets)
- Dark mode toggle
- Sound effects

## License

Open source - feel free to modify and use.
