# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start Vite dev server at localhost:5173
npm run build        # TypeScript build + Vite production build
npm run preview      # Preview production build

# Code Quality  
npm run lint         # ESLint with TypeScript, React hooks, and React refresh rules

# Testing
npm run test         # Vitest in watch mode with jsdom environment
npm run test:run     # Run tests once
```

## Architecture Overview

### Game State Management
The game uses a centralized `GameState` object managed in `GameBoard.tsx` containing:
- 10x10 board with cell states (attacked, hit, ship info)
- Ship objects with position tracking and hit detection
- Game statistics (shots, hits, accuracy)

Core game logic in `src/utils/gameLogic.ts` uses pure functions:
- `attackCell()`: Handles shot validation, hit detection, ship sinking, victory conditions
- `initializeShips()`: Converts static ship layout to trackable ship objects
- `validateShipLayout()`: Validates ship positioning data

### Component Architecture
- **GameBoard**: Main container managing state and user interactions
- **GameGrid**: Renders 10x10 clickable grid
- **GridCell**: Individual cell with visual states (water/hit/miss)  
- **GameStatus**: Displays statistics and feedback

### Styling System
Uses `styled-components` with comprehensive theme system:
- Mobile-first responsive design (320px to 1440px breakpoints)
- Detailed theme object with responsive grid sizing, colors, spacing
- Touch-friendly design with proper tap targets

### Ship Configuration
Ships are pre-positioned via `src/data/shipLayout.ts`:
- Carrier (5 cells), Battleship (4), Cruiser (3), Submarine (3), Destroyer (2)
- Fixed positions for consistent gameplay experience

### Technology Stack
- React 19 + TypeScript with strict mode
- Vite for build tooling with vendor/styled-components chunks
- Vitest + React Testing Library for testing
- ESLint with TypeScript and React rules