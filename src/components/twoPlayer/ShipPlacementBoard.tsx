import React, { useCallback } from 'react';
import styled from 'styled-components';
import DroppableCell from './DroppableCell';
import type { TwoPlayerShip } from '../../types/twoPlayerGame';
import { BOARD_SIZE } from '../../types';

interface ShipPlacementBoardProps {
  ships: TwoPlayerShip[];
  onShipRemove: (shipName: string) => void;
  onShipRotate: (shipName: string) => void;
}


const ShipPlacementBoard: React.FC<ShipPlacementBoardProps> = ({
  ships,
  onShipRemove,
  onShipRotate,
}) => {

  // Check if a cell has a ship
  const getCellShip = useCallback((row: number, col: number): TwoPlayerShip | null => {
    return ships.find(ship => 
      ship.isPlaced && ship.positions.some(pos => pos.row === row && pos.col === col)
    ) || null;
  }, [ships]);

  const renderBoard = () => {
    const board = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const ship = getCellShip(row, col);
        
        board.push(
          <DroppableCell
            key={`${row}-${col}`}
            position={{ row, col }}
            ship={ship}
            onShipRemove={onShipRemove}
            onShipRotate={onShipRotate}
          />
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