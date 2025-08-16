import React from "react";
import styled from "styled-components";
import type { CellState } from "../types";

interface GridCellProps {
  cellState: CellState;
  onClick: () => void;
  row: number;
  col: number;
  disabled?: boolean;
}

interface StyledCellProps {
  $isAttacked: boolean;
  $isHit: boolean;
  $disabled: boolean;
}

const StyledCell = styled.button<StyledCellProps>`
  width: ${({ theme }) => theme.grid.mobile.cellSize};
  height: ${({ theme }) => theme.grid.mobile.cellSize};
  min-width: ${({ theme }) => theme.grid.mobile.cellSize};
  min-height: ${({ theme }) => theme.grid.mobile.cellSize};

  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.mobile.small};
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all ${({ theme }) => theme.transitions.fast};

  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;

  background-color: ${({ theme }) => theme.colors.water};
  box-shadow: ${({ theme }) => theme.shadows.small};

  ${({ $isHit, theme }) =>
    $isHit &&
    `
    background-color: ${theme.colors.hit};
    color: white;
    box-shadow: ${theme.shadows.hitGlow};
    animation: hitPulse 0.6s ease-out;
    
    &::after {
      content: '💥';
      font-size: 14px;
      animation: hitBounce 0.4s ${theme.easing.bounce};
    }
  `}

  ${({ $isAttacked, $isHit, theme }) =>
    $isAttacked &&
    !$isHit &&
    `
    background-color: ${theme.colors.miss};
    color: white;
    
    &::after {
      content: '○';
      font-size: 12px;
      opacity: 0.8;
    }
  `}
  

  ${({ $disabled }) =>
    $disabled &&
    `
    opacity: 0.7;
    cursor: not-allowed;
    
    &:hover {
      transform: none !important;
      box-shadow: none !important;
      background-color: inherit !important;
    }
    
    &:active {
      transform: none !important;
    }
  `}
  

  ${({ $disabled, $isAttacked, theme }) =>
    !$disabled &&
    !$isAttacked &&
    `
    &:hover {
      background-color: ${theme.colors.waterHover};
      transform: translateY(-1px);
      box-shadow: ${theme.shadows.interactive};
      border-color: ${theme.colors.borderActive};
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: ${theme.shadows.small};
      background-color: ${theme.colors.water};
    }
    

    @media (hover: none) and (pointer: coarse) {
      &:active {
        background-color: ${theme.colors.waterHover};
        transform: scale(0.95);
        transition: transform 0.1s ease-out;
      }
    }
  `}
  

  &:focus {
    outline: 3px solid ${({ theme }) => theme.colors.success};
    outline-offset: 2px;
    z-index: 1;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    width: ${({ theme }) => theme.grid.mobileLarge.cellSize};
    height: ${({ theme }) => theme.grid.mobileLarge.cellSize};
    min-width: ${({ theme }) => theme.grid.mobileLarge.cellSize};
    min-height: ${({ theme }) => theme.grid.mobileLarge.cellSize};
    font-size: ${({ theme }) => theme.typography.mobile.body};

    ${({ $isHit }) =>
      $isHit &&
      `
      &::after {
        font-size: 16px;
      }
    `}

    ${({ $isAttacked, $isHit }) =>
      $isAttacked &&
      !$isHit &&
      `
      &::after {
        font-size: 14px;
      }
    `}
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: ${({ theme }) => theme.grid.tablet.cellSize};
    height: ${({ theme }) => theme.grid.tablet.cellSize};
    min-width: ${({ theme }) => theme.grid.tablet.cellSize};
    min-height: ${({ theme }) => theme.grid.tablet.cellSize};
    font-size: ${({ theme }) => theme.typography.tablet.body};
    border-radius: ${({ theme }) => theme.borderRadius.medium};

    ${({ $isHit }) =>
      $isHit &&
      `
      &::after {
        font-size: 20px;
      }
    `}

    ${({ $isAttacked, $isHit }) =>
      $isAttacked &&
      !$isHit &&
      `
      &::after {
        font-size: 18px;
      }
    `}
    
    ${({ $disabled, $isAttacked }) =>
      !$disabled &&
      !$isAttacked &&
      `
      &:hover {
        transform: translateY(-2px);
      }
    `}
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: ${({ theme }) => theme.grid.desktop.cellSize};
    height: ${({ theme }) => theme.grid.desktop.cellSize};
    min-width: ${({ theme }) => theme.grid.desktop.cellSize};
    min-height: ${({ theme }) => theme.grid.desktop.cellSize};
    font-size: ${({ theme }) => theme.typography.desktop.body};

    ${({ $isHit }) =>
      $isHit &&
      `
      &::after {
        font-size: 24px;
      }
    `}

    ${({ $isAttacked, $isHit }) =>
      $isAttacked &&
      !$isHit &&
      `
      &::after {
        font-size: 20px;
      }
    `}
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    width: ${({ theme }) => theme.grid.large.cellSize};
    height: ${({ theme }) => theme.grid.large.cellSize};
    min-width: ${({ theme }) => theme.grid.large.cellSize};
    min-height: ${({ theme }) => theme.grid.large.cellSize};

    ${({ $isHit }) =>
      $isHit &&
      `
      &::after {
        font-size: 26px;
      }
    `}

    ${({ $isAttacked, $isHit }) =>
      $isAttacked &&
      !$isHit &&
      `
      &::after {
        font-size: 22px;
      }
    `}
  }

  @media (max-height: 600px) and (orientation: landscape) {
    width: ${({ theme }) => theme.grid.mobile.cellSize};
    height: ${({ theme }) => theme.grid.mobile.cellSize};
    min-width: ${({ theme }) => theme.grid.mobile.cellSize};
    min-height: ${({ theme }) => theme.grid.mobile.cellSize};
  }

  @keyframes hitPulse {
    0% {
      box-shadow: ${({ theme }) => theme.shadows.small};
    }
    50% {
      box-shadow: ${({ theme }) => theme.shadows.hitGlow};
    }
    100% {
      box-shadow: ${({ theme }) => theme.shadows.hitGlow};
    }
  }

  @keyframes hitBounce {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;

    &:hover {
      transform: none;
    }

    &:active {
      transform: none;
    }

    &::after {
      animation: none;
    }
  }
`;

const GridCell: React.FC<GridCellProps> = ({
  cellState,
  onClick,
  row,
  col,
  disabled = false,
}) => {
  const isDisabled = disabled || cellState.isAttacked;

  const handleClick = () => {
    if (!isDisabled) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === "Enter" || event.key === " ") && !isDisabled) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <StyledCell
      $isAttacked={cellState.isAttacked}
      $isHit={cellState.isHit}
      $disabled={isDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Cell ${row + 1}, ${col + 1}${
        cellState.isAttacked
          ? cellState.isHit
            ? " - Hit"
            : " - Miss"
          : " - Unattacked"
      }`}
      disabled={isDisabled}
      type="button"
    />
  );
};

export default GridCell;
