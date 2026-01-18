# CalcVerse - Interactive Animated Calculator Game

An engaging calculator game where solving math challenges affects the animated environment. Correct answers stabilize the background and unlock new levels, while wrong answers trigger visual distortions and particle explosions.

## Features

- 🎮 **Interactive Gameplay**: Solve math challenges using a fully functional calculator
- 🎨 **Animated Background**: Dynamic particle system with gradient meshes that react to your answers
- ✨ **Visual Feedback**: 
  - Correct answers: Glow effects, stabilized particles
  - Wrong answers: Screen shake, particle explosions
- 🏆 **Scoring System**: Points, levels, and combo multipliers
- ⌨️ **Keyboard Support**: Full keyboard input for calculator operations
- ⏱️ **Time Pressure**: Timer adds urgency and bonus points

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Canvas API** - Particle system

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Run development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Build for production
npm run build
# or
bun build
```

## Game Mechanics

1. **Start Game**: Click "Start Game" on the home page
2. **Solve Challenges**: Math problems appear at the top
3. **Use Calculator**: Solve using the calculator UI or keyboard
4. **Submit Answer**: Press `=` or Enter to submit
5. **Watch Effects**: The background reacts to correct/wrong answers
6. **Level Up**: Every 3 correct answers increases the difficulty level
7. **Build Combos**: Consecutive correct answers increase combo multiplier

## Calculator Controls

- **Numbers**: 0-9 keys or click buttons
- **Operations**: +, -, *, / (or ×, ÷ buttons)
- **Equals**: Enter or = key
- **Clear**: Escape or C key
- **Backspace**: Backspace key

## Project Structure

```
calcverse/
├── app/
│   ├── page.tsx          # Home page
│   ├── game/
│   │   └── page.tsx      # Game page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Calculator.tsx           # Calculator UI component
│   ├── AnimatedBackground.tsx   # Particle system & gradients
│   ├── GameHUD.tsx              # Challenge display & timer
│   └── ScoreBoard.tsx           # Score, level, combo display
├── lib/
│   ├── calculatorLogic.ts  # Calculator engine
│   └── gameEngine.ts        # Game state & challenge generation
└── package.json
```

## License

MIT


