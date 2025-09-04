# Two-Player Battleship Implementation Plan

## Overview
Transform the current single-player "find the ships" game into a full two-player battleship experience where:
1. Player places their own ships
2. Turn-based gameplay: Player vs Computer
3. Both sides have hidden ship layouts
4. First to sink all enemy ships wins

## Implementation Phases

### Phase 1: Game State Extension

#### New Game States
```typescript
type GamePhase = "placement" | "battle" | "gameOver";

interface PlayerBoard {
  ships: Ship[];
  attacks: CellState[][]; // Attacks received on this board
}

interface TwoPlayerGameState {
  phase: GamePhase;
  currentTurn: "player" | "computer";
  playerBoard: PlayerBoard;
  computerBoard: PlayerBoard;
  playerAttacks: CellState[][]; // Player's attacks on computer board
  computerAttacks: CellState[][]; // Computer's attacks on player board
  winner?: "player" | "computer";
  totalShots: { player: number; computer: number };
  hits: { player: number; computer: number };
}
```

#### Updated Types
```typescript
interface Ship {
  name: string;
  positions: Position[];
  hits: boolean[];
  isSunk: boolean;
  orientation: "horizontal" | "vertical";
  isPlaced?: boolean;
}
```

### Phase 2: Ship Placement Phase

#### New Components
- **ShipPlacementBoard.tsx**: Interactive board for placing ships
- **ShipSelector.tsx**: Shows available ships to place
- **PlacementControls.tsx**: Rotate, confirm placement buttons

#### Ship Placement Logic
```typescript
// New functions in gameLogic.ts
export const canPlaceShip = (
  board: CellState[][],
  ship: Ship,
  startPos: Position,
  orientation: "horizontal" | "vertical"
): boolean;

export const placeShip = (
  board: CellState[][],
  ship: Ship,
  startPos: Position,
  orientation: "horizontal" | "vertical"
): { board: CellState[][]; ship: Ship };

export const removeShip = (
  board: CellState[][],
  ship: Ship
): CellState[][];

export const validateAllShipsPlaced = (ships: Ship[]): boolean;
```

#### User Interactions
- Drag & drop ship placement
- Click to select ship, click board to place
- Right-click or button to rotate ships
- Visual feedback for valid/invalid placement
- Ability to move already placed ships

### Phase 3: Computer AI System

#### AI Strategy Levels
```typescript
interface AIConfig {
  strategy: "random" | "smart" | "adaptive";
  difficulty: "easy" | "medium" | "hard";
}

interface AIState {
  targetQueue: Position[]; // Positions to attack after a hit
  lastHit?: Position;
  huntMode: boolean; // Systematic search vs random
  shipSizes: number[]; // Remaining ship sizes to find
}
```

#### AI Attack Logic
```typescript
export const computerAttack = (
  playerBoard: PlayerBoard,
  computerAttacks: CellState[][],
  aiState: AIState
): {
  attackPosition: Position;
  result: AttackResult;
  newAIState: AIState;
};

// Different AI strategies
export const getRandomAttack = (attackedPositions: CellState[][]): Position;
export const getSmartAttack = (
  playerBoard: PlayerBoard,
  attackedPositions: CellState[][],
  aiState: AIState
): Position;
```

### Phase 4: Turn-Based Game Flow

#### Game Flow Manager
```typescript
export const processTurn = (
  gameState: TwoPlayerGameState,
  action: PlayerAction | ComputerAction
): TwoPlayerGameState;

type PlayerAction = {
  type: "attack";
  position: Position;
};

type ComputerAction = {
  type: "attack";
  position: Position;
};
```

#### Turn Sequence
1. Player attacks computer board
2. Check for hit/miss/ship sunk
3. If game not over, computer attacks player board
4. Check for hit/miss/ship sunk
5. Check win conditions
6. Switch turn or end game

### Phase 5: UI/UX Updates

#### Dual Board Layout
- **Desktop**: Side-by-side boards
- **Mobile**: Tabbed interface or single board with toggle

#### New Components Architecture
```
TwoPlayerGameBoard.tsx (main container)
├── GamePhaseManager.tsx
├── ShipPlacementPhase.tsx
│   ├── ShipPlacementBoard.tsx
│   ├── ShipSelector.tsx
│   └── PlacementControls.tsx
├── BattlePhase.tsx
│   ├── PlayerAttackBoard.tsx (attacking computer)
│   ├── PlayerDefenseBoard.tsx (player's ships)
│   ├── TurnIndicator.tsx
│   └── BattleStatus.tsx
└── GameOverPhase.tsx
```

#### Visual Enhancements
- Different visual states for own ships vs enemy attacks
- Turn indicators and animations
- Attack result animations (splash, explosion)
- Ship placement preview and validation feedback

### Phase 6: Game Persistence & Features

#### Additional Features
- Save/load game state
- Game replay system
- Multiple AI difficulty levels
- Custom ship layouts
- Statistics tracking across games

## Technical Implementation Strategy

### Step-by-Step Development
1. **Start with placement phase UI** - Get ship placement working first
2. **Extend game state** - Add dual board support
3. **Implement basic computer AI** - Start with random attacks
4. **Add turn management** - Basic turn switching
5. **Enhance AI intelligence** - Smart targeting after hits
6. **Polish UI/UX** - Animations, better mobile experience

### Backward Compatibility
- Keep current single-player mode as "Practice Mode"
- Add mode selection at game start
- Reuse existing components where possible

### Testing Strategy
- Unit tests for ship placement validation
- AI behavior testing with different scenarios
- Integration tests for full game flow
- Mobile responsiveness testing

## File Structure Changes
```
src/
├── components/
│   ├── common/           # Shared components
│   ├── singlePlayer/     # Current game components
│   ├── twoPlayer/        # New two-player components
│   └── placement/        # Ship placement components
├── hooks/
│   ├── useGameState.ts
│   ├── useShipPlacement.ts
│   └── useComputerAI.ts
├── utils/
│   ├── gameLogic.ts      # Extended for two-player
│   ├── shipPlacement.ts  # New placement logic
│   └── computerAI.ts     # AI logic
└── types/
    └── twoPlayerGame.ts  # Extended type definitions
```

## Estimated Development Time
- **Phase 1-2** (Game state + Ship placement): 8-12 hours
- **Phase 3-4** (AI + Turn management): 6-8 hours  
- **Phase 5** (UI/UX polish): 4-6 hours
- **Phase 6** (Additional features): 4-8 hours

**Total**: 22-34 hours of development time