# Interview Live Coding Preparation

## Most Likely Tasks (1-hour session)

### High Probability Tasks

#### 1. New Game / Reset Functionality
**What:** Add ability to restart the game without page reload
**Implementation:**
- Add "New Game" button in GameStatus component
- Reset game state to initial values
- Clear last action message
- Possibly add confirmation dialog

**Key files:** `GameBoard.tsx`, `GameStatus.tsx`

#### 2. Custom Hooks Refactoring
**What:** Extract game logic from GameBoard into custom hooks
**Implementation:**
- `useGameState()` hook for state management
- `useGameActions()` hook for game actions
- Better separation of concerns

**Key files:** `GameBoard.tsx`, new `src/hooks/` directory

#### 3. Add Unit Tests
**What:** Write tests for existing game logic
**Implementation:**
- Test `attackCell()` function with various scenarios
- Test ship initialization and validation
- Test victory conditions
- Component testing for user interactions

**Key files:** `src/utils/gameLogic.test.ts`, component test files

#### 4. Performance Optimization
**What:** Optimize re-renders and expensive calculations
**Implementation:**
- Add `React.memo` to GridCell component
- Optimize callback dependencies
- Better memoization of derived state

**Key files:** `GridCell.tsx`, `GameBoard.tsx`, `GameGrid.tsx`

### Medium Probability Tasks

#### 5. Accessibility Improvements
**What:** Make game keyboard navigable and screen reader friendly
**Implementation:**
- Add ARIA labels and descriptions
- Keyboard navigation for grid
- Focus management
- Semantic HTML improvements

**Key files:** All component files

#### 6. Visual Enhancements
**What:** Add animations, transitions, or improved visual feedback
**Implementation:**
- Hit/miss animations using CSS transitions
- Ship sinking animation
- Sound effects (optional)
- Better visual states

**Key files:** Styled components, possibly new animation utilities

#### 7. Game Statistics Enhancement
**What:** Add more detailed statistics and history
**Implementation:**
- Track game time
- Show accuracy percentage more prominently  
- Add shot history visualization
- Best game stats

**Key files:** `GameStatus.tsx`, game logic functions

#### 8. Error Handling & Edge Cases
**What:** Improve error handling and user experience
**Implementation:**
- Better error boundaries
- Graceful handling of invalid states
- User-friendly error messages
- Loading states

**Key files:** `GameBoard.tsx`, game logic functions

### Lower Probability (Complex) Tasks

#### 9. Ship Placement Phase
**What:** Let player place their own ships before game starts
**Implementation:**
- New game phase state
- Drag & drop ship placement
- Validation for ship placement rules
- Ship rotation functionality

#### 10. Multiple Difficulty Levels
**What:** Different ship layouts or board sizes
**Implementation:**
- Difficulty selection UI
- Multiple ship layout configurations
- Dynamic board size support

#### 11. Dark Mode Theme
**What:** Add theme switching capability
**Implementation:**
- Extend theme system
- Theme toggle component
- Persistent theme preference

## Preparation Strategy

### Code Areas to Review
1. **Game Logic (`gameLogic.ts`)**: Understand every function thoroughly
2. **State Management**: How GameBoard manages and updates state  
3. **Component Props**: Interface between components
4. **Styled Components**: Theme system and responsive design patterns

### Key React Patterns to Know
- `useCallback` and `useMemo` optimization patterns
- Custom hooks creation and usage
- Component composition patterns
- Error boundaries
- Testing with React Testing Library

### TypeScript Knowledge
- Interface definitions and type safety
- Generic types usage
- Type guards and validation
- Proper typing for event handlers

### Common Interview Questions
- "How would you make this component more reusable?"
- "What performance optimizations can we apply?"
- "How would you test this functionality?"
- "What accessibility concerns do you see?"
- "How would you handle errors in this scenario?"

### Before the Interview
1. Run the app and test all functionality
2. Review each component's responsibility
3. Understand the data flow completely
4. Practice explaining your architectural decisions
5. Have your IDE set up with extensions ready
6. Test that screen sharing works properly

### During the Interview
- Think out loud about your approach
- Ask clarifying questions about requirements
- Start with the simplest solution, then iterate
- Use AI for boilerplate/syntax, not problem-solving logic
- Be open to feedback and alternative approaches
- Focus on code quality and best practices