import React from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import type { TwoPlayerShip } from '../../types/twoPlayerGame';
import type { Position } from '../../types';

interface DroppableCellProps {
  position: Position;
  ship: TwoPlayerShip | null;
  onShipRemove: (shipName: string) => void;
  onShipRotate: (shipName: string) => void;
}

const DroppableCell: React.FC<DroppableCellProps> = ({
  position,
  ship,
  onShipRemove,
  onShipRotate,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${position.row}-${position.col}`,
    data: {
      position,
    },
  });

  const handleCellClick = () => {
    if (ship) {
      onShipRotate(ship.name);
    }
  };

  const handleCellRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (ship) {
      onShipRemove(ship.name);
    }
  };

  return (
    <Cell
      ref={setNodeRef}
      $hasShip={!!ship}
      $isOver={isOver}
      onClick={handleCellClick}
      onContextMenu={handleCellRightClick}
      title={
        ship
          ? `${ship.name} - Left click to rotate, Right click to remove`
          : 'Drop ship here'
      }
    >
      {ship && (
        <ShipPart>
          {ship.name.charAt(0).toUpperCase()}
        </ShipPart>
      )}
    </Cell>
  );
};

export default DroppableCell;

const Cell = styled.div<{ $hasShip: boolean; $isOver: boolean }>`
  width: ${({ theme }) => theme.grid.mobile.cellSize};
  height: ${({ theme }) => theme.grid.mobile.cellSize};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme, $hasShip, $isOver }) => {
    if ($isOver) return theme.colors.water;
    if ($hasShip) return theme.colors.ship;
    return theme.colors.white;
  }};
  cursor: ${({ $hasShip }) => ($hasShip ? 'pointer' : 'default')};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  &:hover {
    ${({ $hasShip, $isOver, theme }) => {
      if ($isOver) return `background-color: ${theme.colors.waterHover};`;
      if ($hasShip) return `background-color: ${theme.colors.ship}; transform: scale(1.05);`;
      return `background-color: ${theme.colors.backgroundDark};`;
    }}
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

  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    width: ${({ theme }) => theme.grid.large.cellSize};
    height: ${({ theme }) => theme.grid.large.cellSize};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:hover {
      transform: none;
    }
  }
`;

const ShipPart = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.mobile.small};
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.small};
  }
`;