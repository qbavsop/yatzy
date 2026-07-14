# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page vanilla-JS Progressive Web App that tracks scores for Generał (the Polish/European variant of Yahtzee) played with physical dice. There is no build step, no bundler, and no package.json — the app runs directly from static files. All source lives in `dice-game-app/`.

`rules.md` and `App.md` at the repo root are Polish-language design/spec notes (game rules, screen-by-screen UI spec, color palette) written during design — read them if a change needs to match the intended game rules or visual spec. `screen-*.png/jpg` and `table.jpg` are reference screenshots/mockups of each screen.

## Running the app

No dependencies to install. Serve the `dice-game-app/` directory over HTTP (the service worker requires HTTP(S), not `file://`):

```bash
cd dice-game-app
python -m http.server 8000    # or: npx http-server
# open http://localhost:8000
```

There is no test suite, linter, or build/compile step in this repo.

## Architecture

Everything is driven by one `DiceGameApp` class in `dice-game-app/app.js`, instantiated on `DOMContentLoaded`. It holds a single `gameState` object (`players`, `currentPlayerIndex`, `currentRound`, `pendingYahtzeeBonus`, `selectedCombo`) and no other state — there is no persistence (localStorage), routing, or component framework.

**Screen flow** is template-based, not component-based: `index.html` defines each screen as an inert `<template>` (`screen-welcome`, `screen-player-setup`, `screen-splash`, `screen-scorecard`, `screen-gameplay`, `screen-joker-selection`, `screen-results`). Each `DiceGameApp.showXScreen()` method clones the matching template into `#app`, wires up its event listeners, and mutates `gameState`. Screens transition by directly calling the next `showXScreen()` — there's no router or history stack, so back/forward doesn't work.

Turn sequence: welcome → player-setup → (per round, per player) splash → scorecard → gameplay → \[joker-selection if a Yahtzee bonus applies] → back to splash for the next player, looping until `currentRound > 13`, then → results.

**Scoring is fully decoupled from the UI**: `dice-game-app/scoring.js` defines `ScoringEngine`, a static-method-only class with no DOM or state dependencies — it takes `dice` (array of 5 values) and `usedCategories` (a player's `scores` object) and returns valid combinations/scores. Category keys (`ones`, `twos`, ..., `three`, `four`, `full`, `ss`, `ls`, `general`, `general_bonus`, `chance`) are the canonical identifiers used throughout `app.js`, the i18n JSON files, and `CATEGORY_NAMES`/`CATEGORY_ICONS`. When adding a category, it must be added consistently across `ScoringEngine.getValidCombinations`, `CATEGORY_NAMES`/`CATEGORY_ICONS`, the upper/lower category arrays repeated in `app.js` (scorecard rendering, gameplay combos, results breakdown), and both `langs/*.json` files.

**Yahtzee/Generał joker rule**: when a player rolls a second Yahtzee after already scoring 50 in `general`, `ScoringEngine.isYahtzeeBonus` detects it and `app.js` routes to `showJokerSelectionScreen()` instead of the normal combo list. `ScoringEngine.getJokerOptions` implements the priority order: matching upper category first (if open), then any open lower category (as a joker at its fixed score), then remaining upper categories (forced, worth 0 unless it matches the rolled value). Each additional bonus Yahtzee adds +100 to `scores.general_bonus`. This logic mirrors the rules documented in `rules.md`'s "Joker reguły" section.

**i18n** (`dice-game-app/localization.js`) is a minimal custom implementation, not a library: a global `i18n` object fetches `langs/{lang}.json` and exposes `i18n.t(key, vars)` (supports `{{var}}` interpolation and a `.default` fallback) plus `translateContainer(el)`, which walks `[data-i18n]` attributes. Language is detected from `navigator.language`, overridable via a `<select id="language-selector">` present on the welcome screen (and injected onto other screens by `ensureLangSelector()`), persisted to `localStorage['lang']`, and applied by a full `location.reload()` rather than live re-render. `en.json` and `pl.json` must be kept in sync — every `data-i18n` key and every `category.*` / `scorecard.*` / `joker.*` key referenced via `i18n.t()` in `app.js` needs an entry in both files.

**Styling** (`dice-game-app/style.css`) uses a fixed 3-color palette defined as CSS variables: slate-800 (`#1D293D`, background), slate-600 (`#45556C`, inactive), orange (`#FF8102`, active/selected/accent), plus slate-700 (`#314158`) for bonus row backgrounds. Preserve this palette when touching UI — it's an explicit design constraint (see `rules.md`).

**Offline support**: `sw.js` is a plain cache-first service worker with a hardcoded `CACHE_NAME` (`dice-game-v2`) and `FILES_TO_CACHE` list. Bump `CACHE_NAME` and update `FILES_TO_CACHE` when adding/renaming cached assets, otherwise returning users get stale files.
