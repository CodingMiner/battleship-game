# 🚢 Battleship Game

A modern, responsive implementation of the classic Battleship game built with React, TypeScript, and styled-components.

## 🎮 Game Overview

Experience the classic naval strategy game in a modern web interface. Click on the grid to fire shots, sink enemy ships, and achieve victory by destroying all 5 ships on the board.

### 🎯 Game Features

- **10x10 Interactive Grid**: Click cells to fire shots at hidden enemy ships
- **5 Ship Types**: Carrier (5), Battleship (4), Cruiser (3), Submarine (3), Destroyer (2)
- **Real-time Feedback**: Immediate hit/miss indicators with visual and text feedback
- **Game Statistics**: Track shots fired, hits, misses, and accuracy percentage
- **Ship Status**: Monitor which ships are still active vs. sunk
- **Victory Detection**: Automatic game completion when all ships are destroyed

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd battleship-game

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

## 🎮 How to Play

1. **Start the Game**: The game begins with all ships hidden on a 10x10 grid
2. **Fire Shots**: Click on any cell to fire a shot at that position
3. **Get Feedback**:
   - 🎯 **Hit!** - You've hit part of a ship
   - 💧 **Miss!** - No ship at that location
   - 🚢 **Ship Sunk!** - You've destroyed an entire ship
4. **Track Progress**: Monitor your statistics and remaining ships
5. **Win Condition**: Destroy all 5 ships to achieve victory!

### Ship Layout

Ships are pre-positioned according to the game configuration:

- **Destroyer** (2 cells): Vertical at [0,0] - [1,0]
- **Submarine** (3 cells): Horizontal at [3,0] - [3,2]
- **Battleship** (4 cells): Horizontal at [5,2] - [5,5]
- **Cruiser** (3 cells): Horizontal at [8,1] - [8,3]
- **Carrier** (5 cells): Vertical at [2,9] - [6,9]

## 🏗️ Project Structure

```
battleship-game/
├── src/
│   ├── components/          # React components
│   │   ├── GameBoard.tsx    # Main game container
│   │   ├── GameGrid.tsx     # 10x10 game grid
│   │   ├── GridCell.tsx     # Individual cell component
│   │   └── GameStatus.tsx   # Game statistics and feedback
│   ├── utils/               # Utility functions
│   │   └── gameLogic.ts     # Core game logic
│   ├── data/                # Game configuration
│   │   └── shipLayout.ts    # Ship positioning data
│   ├── types/               # TypeScript type definitions
│   │   └── game.ts          # Game-related types
│   ├── test/                # Test configuration
│   └── theme.ts             # Styled-components theme
├── public/                  # Static assets
├── dist/                    # Production build output
└── docs/                    # Documentation files
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
```

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Comprehensive linting rules
- **Prettier**: Code formatting (via IDE integration)
