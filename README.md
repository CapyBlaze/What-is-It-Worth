<h1 align="center">What's It Worth</h1>

<a id="readme-top"></a>

<p align="center">
    <img src="https://img.shields.io/badge/Vite-8.1-646CFF?style=flat-square&logo=vite" alt="Vite"/>
    <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js" alt="Vue"/>
    <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/license-MIT-2D333B?style=flat-square" alt="MIT License"/>
</p>

<p align="center">
    A browser game where you inspect a random Amazon product and try to guess its real price as accurately as possible.
</p>

---

## Overview

What's It Worth is a price guessing game built with Vue and Vite. A product card, an image, and a price gauge are shown to the player, who submits a guess and then sees the real price, the score awarded, and the price gap.

### Features

- Random product selection from CSV data.
- Category filtering for different product groups.
- Price guessing with score calculation.
- Visual feedback with a gauge, target marker, and real price marker.
- Persistent total score in local storage.

## Getting Started

### Requirements

- Node.js 18+.
- npm.

### Install and run

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

### Build for production

```bash
npm run build
```

### Preview the build

```bash
npm run preview
```

## How It Works

1. A product is loaded from the CSV dataset in `public/data`.
2. You enter a price guess and validate it.
3. The app reveals the true price, updates the gauge, and awards points based on accuracy.
4. You can move to the next product or reset the total score.

## Project Structure

- `src/App.vue`: main game layout.
- `src/components/`: header, product card, controls, gauge, and result panel.
- `src/composables/useGame.ts`: game state, scoring, and product loading.
- `public/data/`: product CSV chunks and the generated category index.
- `scripts/build-category-index.mjs`: helper script for dataset indexing.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- CSV-based local dataset

## Notes

- The app is fully client-side.
- Product images and prices come from the dataset included in the project.
- If the dataset is updated, regenerate the category index before running the game.

## License

MIT
