import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import GridCell from "./GridCell";
import type { CellState } from "../types";
import { BOARD_SIZE } from "../types";

interface GameGridProps {
  board: CellState[][];
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
}

const GameGrid: React.FC<GameGridProps> = React.memo(({
  board,
  onCellClick,
  disabled = false,
}) => {
  const handleCellClick = useCallback((row: number, col: number) => {
    if (!disabled) {
      onCellClick(row, col);
    }
  }, [disabled, onCellClick]);

  // Create stable click handlers for each cell to prevent unnecessary re-renders
  const cellClickHandlers = useMemo(() => {
    const handlers: Array<Array<() => void>> = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      handlers[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        handlers[row][col] = () => handleCellClick(row, col);
      }
    }
    return handlers;
  }, [handleCellClick]);

  return (
    <GridContainer role="grid" aria-label="Battleship game board">
      {board.map((row, rowIndex) =>
        row.map((cellState, colIndex) => (
          <GridCell
            key={`${rowIndex}-${colIndex}`}
            cellState={cellState}
            onClick={cellClickHandlers[rowIndex][colIndex]}
            row={rowIndex}
            col={colIndex}
            disabled={disabled}
          />
        ))
      )}
    </GridContainer>
  );
});

export default GameGrid;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
  grid-template-rows: repeat(${BOARD_SIZE}, 1fr);

  gap: ${({ theme }) => theme.grid.mobile.gap};
  padding: ${({ theme }) => theme.grid.mobile.containerPadding};
  max-width: ${({ theme }) => theme.grid.mobile.maxWidth};

  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};

  margin: 0 auto;
  width: 100%;
  aspect-ratio: 1;

  max-height: calc(100vh - 200px);
  max-height: calc(100dvh - 200px);

  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    gap: ${({ theme }) => theme.grid.mobileLarge.gap};
    padding: ${({ theme }) => theme.grid.mobileLarge.containerPadding};
    max-width: ${({ theme }) => theme.grid.mobileLarge.maxWidth};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.grid.tablet.gap};
    padding: ${({ theme }) => theme.grid.tablet.containerPadding};
    max-width: ${({ theme }) => theme.grid.tablet.maxWidth};
    max-height: calc(100vh - 250px);
    max-height: calc(100dvh - 250px);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    gap: ${({ theme }) => theme.grid.desktop.gap};
    padding: ${({ theme }) => theme.grid.desktop.containerPadding};
    max-width: ${({ theme }) => theme.grid.desktop.maxWidth};
    max-height: calc(100vh - 300px);
    max-height: calc(100dvh - 300px);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    gap: ${({ theme }) => theme.grid.large.gap};
    padding: ${({ theme }) => theme.grid.large.containerPadding};
    max-width: ${({ theme }) => theme.grid.large.maxWidth};
  }

  @media (max-height: 600px) and (orientation: landscape) {
    gap: ${({ theme }) => theme.grid.mobile.gap};
    padding: ${({ theme }) => theme.spacing.sm};
    max-width: ${({ theme }) => theme.grid.mobile.maxWidth};
    max-height: calc(100vh - 120px);
    max-height: calc(100dvh - 120px);
  }

  @media (prefers-contrast: high) {
    border-width: 3px;
    border-color: ${({ theme }) => theme.colors.text};
  }
`;
