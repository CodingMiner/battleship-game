import React, { useCallback } from 'react';
import styled from 'styled-components';
import type { CellState } from '../../types';
import type { TwoPlayerShip } from '../../types/twoPlayerGame';
import type { Position } from '../../types';
import { BOARD_SIZE } from '../../types';
import { ATTACK_ASSETS } from '../../types/twoPlayerGame';

interface BattleGridProps {
  attackBoard: CellState[][];
  ships?: TwoPlayerShip[]; // Only provided for player's defensive board
  onCellClick?: (position: Position) => void;
  disabled?: boolean;
  isPlayerBoard?: boolean;
  title: string;
}

const BattleGrid: React.FC<BattleGridProps> = ({
  attackBoard,
  ships = [],
  onCellClick,
  disabled = false,
  isPlayerBoard = false,
  title
}) => {
  const handleCellClick = useCallback((row: number, col: number) => {
    if (!disabled && onCellClick && !isPlayerBoard) {
      onCellClick({ row, col });
    }
  }, [disabled, onCellClick, isPlayerBoard]);

  const getCellState = useCallback((row: number, col: number) => {
    const attackCell = attackBoard[row][col];
    let hasPlayerShip = false;
    
    // For player's defensive board, show their ships
    if (isPlayerBoard && ships.length > 0) {
      hasPlayerShip = ships.some(ship => 
        ship.isPlaced && ship.positions.some(pos => pos.row === row && pos.col === col)
      );
    }

    return {
      isAttacked: attackCell.isAttacked,
      isHit: attackCell.isHit,
      hasPlayerShip,
      canAttack: !attackCell.isAttacked && !isPlayerBoard && !disabled
    };
  }, [attackBoard, ships, isPlayerBoard, disabled]);

  const renderBoard = () => {
    const board = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cellState = getCellState(row, col);
        
        board.push(
          <BattleCell
            key={`${row}-${col}`}
            $isAttacked={cellState.isAttacked}
            $isHit={cellState.isHit}
            $hasPlayerShip={cellState.hasPlayerShip}
            $canAttack={cellState.canAttack}
            $isPlayerBoard={isPlayerBoard}
            onClick={() => handleCellClick(row, col)}
            title={
              isPlayerBoard 
                ? `Your ${String.fromCharCode(65 + col)}${row + 1}${cellState.isAttacked ? (cellState.isHit ? ' - Hit!' : ' - Miss') : ''}`
                : `Enemy ${String.fromCharCode(65 + col)}${row + 1}${cellState.isAttacked ? (cellState.isHit ? ' - Hit!' : ' - Miss') : ' - Click to attack'}`
            }
          >
            {cellState.isAttacked && (
              <AttackResult $isHit={cellState.isHit}>
                {cellState.isHit ? (
                  <AttackIcon
                    src={ATTACK_ASSETS.hitSmall}
                    alt="Hit"
                    $isHit={true}
                  />
                ) : (
                  <AttackIcon
                    src={ATTACK_ASSETS.missSmall}
                    alt="Miss"
                    $isHit={false}
                  />
                )}
              </AttackResult>
            )}
            
            {cellState.hasPlayerShip && (
              <ShipIndicator $isHit={cellState.isAttacked && cellState.isHit}>
                ⚓
              </ShipIndicator>
            )}
          </BattleCell>
        );
      }
    }
    
    return board;
  };

  return (
    <GridContainer>
      <GridTitle>{title}</GridTitle>
      <GridBoard>
        {renderBoard()}
      </GridBoard>
      <GridInfo>
        {isPlayerBoard ? (
          <InfoText>Your fleet - defend against enemy attacks</InfoText>
        ) : (
          <InfoText>Enemy waters - click to attack</InfoText>
        )}
      </GridInfo>
    </GridContainer>
  );
};

export default BattleGrid;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const GridTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: bold;
  margin: 0;
  text-align: center;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.body};
  }
`;

const GridBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
  grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
  gap: ${({ theme }) => theme.grid.mobile.gap};
  
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  width: 280px;
  height: 280px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 320px;
    height: 320px;
    gap: ${({ theme }) => theme.grid.tablet.gap};
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 400px;
    height: 400px;
    gap: ${({ theme }) => theme.grid.desktop.gap};
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const BattleCell = styled.div<{ 
  $isAttacked: boolean; 
  $isHit: boolean; 
  $hasPlayerShip: boolean;
  $canAttack: boolean;
  $isPlayerBoard: boolean;
}>`
  aspect-ratio: 1;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: ${({ $canAttack, $isPlayerBoard }) => 
    $canAttack ? 'crosshair' : $isPlayerBoard ? 'default' : 'not-allowed'
  };
  
  background-color: ${({ theme, $isAttacked, $isHit, $hasPlayerShip }) => {
    if ($isAttacked && $isHit) return theme.colors.hit;
    if ($isAttacked && !$isHit) return theme.colors.miss;
    if ($hasPlayerShip) return theme.colors.ship;
    return theme.colors.water;
  }};
  
  ${({ $canAttack, theme }) => $canAttack && `
    &:hover {
      background-color: ${theme.colors.waterHover};
      border-color: ${theme.colors.borderActive};
      transform: scale(1.05);
      box-shadow: ${theme.shadows.interactive};
    }
  `}

  ${({ $isAttacked }) => $isAttacked && `
    &:hover {
      transform: none !important;
    }
  `}

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

const AttackResult = styled.div<{ $isHit: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const AttackIcon = styled.img<{ $isHit: boolean }>`
  width: 16px;
  height: 16px;
  object-fit: contain;
  
  filter: ${({ $isHit }) => $isHit ? 'drop-shadow(0 0 4px rgba(231, 76, 60, 0.8))' : 'none'};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 20px;
    height: 20px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 24px;
    height: 24px;
  }
`;

const ShipIndicator = styled.div<{ $isHit: boolean }>`
  font-size: 14px;
  color: ${({ theme, $isHit }) => $isHit ? theme.colors.white : theme.colors.background};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 16px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: 18px;
  }
`;

const GridInfo = styled.div`
  text-align: center;
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.mobile.small};
  margin: 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
  }
`;