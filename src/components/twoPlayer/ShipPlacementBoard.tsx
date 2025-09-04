import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import type { TwoPlayerShip, ShipOrientation, PlacementValidation } from '../../types/twoPlayerGame';
import type { Position } from '../../types';
import { BOARD_SIZE } from '../../types';

interface ShipPlacementBoardProps {
  ships: TwoPlayerShip[];
  onShipPlace: (shipName: string, position: Position, orientation: ShipOrientation) => PlacementValidation;
  onShipRemove: (shipName: string) => void;
  onShipRotate: (shipName: string) => void;
  draggedShip: string | null;
  onDragEnd: () => void;
}

interface CellProps {
  $hasShip: boolean;
  $isValidDrop: boolean;
  $isInvalidDrop: boolean;
}

const ShipPlacementBoard: React.FC<ShipPlacementBoardProps> = ({
  ships,
  onShipPlace,
  onShipRemove,
  onShipRotate,
  draggedShip,
  onDragEnd,
}) => {
  const [dragOverCell, setDragOverCell] = useState<Position | null>(null);
  const [dragValidation, setDragValidation] = useState<PlacementValidation | null>(null);

  // Check if a cell has a ship
  const getCellShip = useCallback((row: number, col: number): TwoPlayerShip | null => {
    return ships.find(ship => 
      ship.isPlaced && ship.positions.some(pos => pos.row === row && pos.col === col)
    ) || null;
  }, [ships]);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (draggedShip) {
      const ship = ships.find(s => s.name === draggedShip);
      if (ship) {
        const validation = onShipPlace(draggedShip, { row, col }, ship.orientation);
        setDragOverCell({ row, col });
        setDragValidation(validation);
      }
    }
  }, [draggedShip, ships, onShipPlace]);

  // Handle drag leave
  const handleDragLeave = useCallback(() => {
    setDragOverCell(null);
    setDragValidation(null);
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (draggedShip) {
      const ship = ships.find(s => s.name === draggedShip);
      if (ship) {
        const validation = onShipPlace(draggedShip, { row, col }, ship.orientation);
        if (!validation.canPlace) {
          // Show error feedback
          console.warn(validation.errorMessage);
        }
      }
    }
    
    setDragOverCell(null);
    setDragValidation(null);
    onDragEnd();
  }, [draggedShip, ships, onShipPlace, onDragEnd]);

  // Handle ship click (for rotation or removal)
  const handleShipClick = useCallback((e: React.MouseEvent, ship: TwoPlayerShip) => {
    e.preventDefault();
    
    if (e.button === 0) { // Left click - rotate
      onShipRotate(ship.name);
    } else if (e.button === 2) { // Right click - remove
      onShipRemove(ship.name);
    }
  }, [onShipRotate, onShipRemove]);

  // Get cell state for styling
  const getCellState = useCallback((row: number, col: number) => {
    const hasShip = getCellShip(row, col) !== null;
    let isValidDrop = false;
    let isInvalidDrop = false;

    if (dragOverCell && dragValidation && draggedShip) {
      const ship = ships.find(s => s.name === draggedShip);
      if (ship) {
        // Check if this cell would be part of the dropped ship
        const wouldContainShip = ship.orientation === "horizontal"
          ? row === dragOverCell.row && col >= dragOverCell.col && col < dragOverCell.col + ship.size
          : col === dragOverCell.col && row >= dragOverCell.row && row < dragOverCell.row + ship.size;

        if (wouldContainShip) {
          isValidDrop = dragValidation.canPlace;
          isInvalidDrop = !dragValidation.canPlace;
        }
      }
    }

    return { hasShip, isValidDrop, isInvalidDrop };
  }, [getCellShip, dragOverCell, dragValidation, draggedShip, ships]);

  const renderBoard = () => {
    const board = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const ship = getCellShip(row, col);
        const cellState = getCellState(row, col);
        
        board.push(
          <PlacementCell
            key={`${row}-${col}`}
            $hasShip={cellState.hasShip}
            $isValidDrop={cellState.isValidDrop}
            $isInvalidDrop={cellState.isInvalidDrop}
            onDragOver={(e) => handleDragOver(e, row, col)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, row, col)}
            onClick={(e) => ship && handleShipClick(e, ship)}
            onContextMenu={(e) => {
              e.preventDefault();
              if (ship) handleShipClick(e, ship);
            }}
            title={
              ship 
                ? `${ship.name} (${ship.orientation}) - Left click to rotate, Right click to remove`
                : `Cell ${row + 1}, ${col + 1}`
            }
          >
            {ship && (
              <ShipIndicator>
                {ship.name[0].toUpperCase()}
              </ShipIndicator>
            )}
          </PlacementCell>
        );
      }
    }
    
    return board;
  };

  return (
    <BoardContainer>
      <BoardGrid>
        {renderBoard()}
      </BoardGrid>
      <Instructions>
        <InstructionText>
          Drag ships from the sidebar to place them on the board
        </InstructionText>
        <InstructionText>
          Left click placed ships to rotate • Right click to remove
        </InstructionText>
      </Instructions>
    </BoardContainer>
  );
};

export default ShipPlacementBoard;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
  grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
  gap: ${({ theme }) => theme.grid.mobile.gap};
  padding: ${({ theme }) => theme.grid.mobile.containerPadding};
  
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  
  aspect-ratio: 1;
  max-width: ${({ theme }) => theme.grid.mobile.maxWidth};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    gap: ${({ theme }) => theme.grid.mobileLarge.gap};
    padding: ${({ theme }) => theme.grid.mobileLarge.containerPadding};
    max-width: ${({ theme }) => theme.grid.mobileLarge.maxWidth};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.grid.tablet.gap};
    padding: ${({ theme }) => theme.grid.tablet.containerPadding};
    max-width: ${({ theme }) => theme.grid.tablet.maxWidth};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    gap: ${({ theme }) => theme.grid.desktop.gap};
    padding: ${({ theme }) => theme.grid.desktop.containerPadding};
    max-width: ${({ theme }) => theme.grid.desktop.maxWidth};
  }
`;

const PlacementCell = styled.div<CellProps>`
  width: ${({ theme }) => theme.grid.mobile.cellSize};
  height: ${({ theme }) => theme.grid.mobile.cellSize};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  
  transition: all ${({ theme }) => theme.transitions.fast};
  
  background-color: ${({ theme, $hasShip, $isValidDrop, $isInvalidDrop }) => {
    if ($isValidDrop) return theme.colors.successLight;
    if ($isInvalidDrop) return theme.colors.error;
    if ($hasShip) return theme.colors.ship;
    return theme.colors.water;
  }};
  
  border-color: ${({ theme, $isValidDrop, $isInvalidDrop }) => {
    if ($isValidDrop) return theme.colors.success;
    if ($isInvalidDrop) return theme.colors.error;
    return theme.colors.border;
  }};
  
  &:hover {
    ${({ $hasShip, theme }) => !$hasShip && `
      background-color: ${theme.colors.waterHover};
      border-color: ${theme.colors.borderActive};
    `}
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    width: ${({ theme }) => theme.grid.mobileLarge.cellSize};
    height: ${({ theme }) => theme.grid.mobileLarge.cellSize};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: ${({ theme }) => theme.grid.tablet.cellSize};
    height: ${({ theme }) => theme.grid.tablet.cellSize};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: ${({ theme }) => theme.grid.desktop.cellSize};
    height: ${({ theme }) => theme.grid.desktop.cellSize};
  }
`;

const ShipIndicator = styled.div`
  font-size: ${({ theme }) => theme.typography.mobile.small};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.small};
  }
`;

const Instructions = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const InstructionText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.mobile.small};
  margin: ${({ theme }) => theme.spacing.xs} 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.small};
  }
`;