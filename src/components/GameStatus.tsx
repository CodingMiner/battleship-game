import React from "react";
import styled from "styled-components";
import type { GameState } from "../types";

interface GameStatusProps {
  gameState: GameState;
  onRestart: () => void;
  lastAction?: string;
}

const GameStatus: React.FC<GameStatusProps> = ({
  gameState,
  lastAction,
  onRestart,
}) => {
  const { ships, gameStatus, totalShots, hits } = gameState;

  const missCount = totalShots - hits;
  const accuracy = totalShots > 0 ? Math.round((hits / totalShots) * 100) : 0;

  const shipsSunk = ships.filter((ship) => ship.isSunk).length;

  const getStatusMessage = (): {
    message: string;
    type: "hit" | "miss" | "sunk" | "victory" | "error" | "default";
  } => {
    if (gameStatus === "won") {
      return {
        message: "🎉 Victory! All ships destroyed! 🎉",
        type: "victory",
      };
    }

    if (lastAction) {
      if (lastAction.includes("Error:")) {
        return {
          message: lastAction,
          type: "error",
        };
      }

      if (
        lastAction.includes("already fired") ||
        lastAction.includes("Invalid coordinates") ||
        lastAction.includes("already complete")
      ) {
        return {
          message: lastAction,
          type: "error",
        };
      }

      const recentlySunkShip = ships.find(
        (ship) => ship.isSunk && lastAction.includes("Hit")
      );

      if (recentlySunkShip) {
        return {
          message: `${
            recentlySunkShip.name.charAt(0).toUpperCase() +
            recentlySunkShip.name.slice(1)
          } Sunk! 💥`,
          type: "sunk",
        };
      }

      if (lastAction.includes("Hit")) {
        return {
          message: "Hit! 🎯",
          type: "hit",
        };
      }

      if (lastAction.includes("Miss")) {
        return {
          message: "Miss! 💧",
          type: "miss",
        };
      }
    }

    return {
      message: "Click on the grid to fire!",
      type: "default",
    };
  };

  const { message, type } = getStatusMessage();

  return (
    <StatusContainer>
      <StatusMessage $type={type}>{message}</StatusMessage>

      <StatsContainer>
        <StatItem>
          <StatLabel>Shots Fired</StatLabel>
          <StatValue>{totalShots}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Hits</StatLabel>
          <StatValue>{hits}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Misses</StatLabel>
          <StatValue>{missCount}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Accuracy</StatLabel>
          <StatValue>{accuracy}%</StatValue>
        </StatItem>
      </StatsContainer>

      <ShipsStatus>
        <ShipsTitle>
          Ships: {shipsSunk}/{ships.length} Destroyed
        </ShipsTitle>
        <ShipsList>
          {ships.map((ship, index) => (
            <ShipItem key={`${ship.name}-${index}`} $isSunk={ship.isSunk}>
              {ship.name}
            </ShipItem>
          ))}
        </ShipsList>
        <RestartButton onClick={onRestart}>Restart Game</RestartButton>
      </ShipsStatus>
    </StatusContainer>
  );
};

export default GameStatus;

const StatusContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  text-align: center;
  width: 100%;
  max-width: 100%;

  padding: ${({ theme }) => theme.spacing.md};

  box-sizing: border-box;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
    max-width: 600px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: ${({ theme }) => theme.spacing.xl};
    max-width: 700px;
  }

  @media (max-height: 600px) and (orientation: landscape) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const StatusMessage = styled.div<{
  $type: "hit" | "miss" | "sunk" | "victory" | "error" | "default";
}>`
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.3;

  font-size: ${({ theme }) => theme.typography.mobile.subtitle};

  color: ${({ theme, $type }) => {
    switch ($type) {
      case "hit":
        return theme.colors.hit;
      case "miss":
        return theme.colors.miss;
      case "sunk":
        return theme.colors.success;
      case "victory":
        return theme.colors.success;
      case "error":
        return theme.colors.error || theme.colors.hit;
      default:
        return theme.colors.text;
    }
  }};

  transition: all ${({ theme }) => theme.transitions.normal};

  ${({ $type }) =>
    ($type === "hit" || $type === "sunk" || $type === "victory") &&
    `
    text-shadow: 0 0 10px currentColor;
    animation: messageGlow 0.6s ease-out;
  `}

  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    font-size: ${({ theme }) => theme.typography.tablet.subtitle};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.subtitle};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.subtitle};
  }

  @media (max-height: 600px) and (orientation: landscape) {
    font-size: ${({ theme }) => theme.typography.mobile.body};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  @keyframes messageGlow {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    text-shadow: none;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (max-height: 600px) and (orientation: landscape) {
    gap: ${({ theme }) => theme.spacing.xs};
    margin-top: ${({ theme }) => theme.spacing.sm};
  }
`;

const StatItem = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all ${({ theme }) => theme.transitions.fast};

  padding: ${({ theme }) => theme.spacing.sm};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-1px);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (max-height: 600px) and (orientation: landscape) {
    padding: ${({ theme }) => theme.spacing.xs};
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: 500;

  font-size: ${({ theme }) => theme.typography.mobile.small};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    font-size: ${({ theme }) => theme.typography.mobile.body};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.body};
  }
`;

const StatValue = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};

  font-size: ${({ theme }) => theme.typography.mobile.subtitle};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    font-size: ${({ theme }) => theme.typography.tablet.subtitle};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.subtitle};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.subtitle};
  }
`;

const ShipsStatus = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-height: 600px) and (orientation: landscape) {
    margin-top: ${({ theme }) => theme.spacing.sm};
    padding-top: ${({ theme }) => theme.spacing.sm};
  }
`;

const ShipsTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-weight: bold;

  font-size: ${({ theme }) => theme.typography.mobile.body};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.subtitle};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.subtitle};
  }

  @media (max-height: 600px) and (orientation: landscape) {
    font-size: ${({ theme }) => theme.typography.mobile.small};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

const ShipsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: center;
  align-items: center;

  /* Tablet and up */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;
const RestartButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.white};
`;

const ShipItem = styled.span<{ $isSunk: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: bold;
  text-transform: capitalize;
  color: white;
  transition: all ${({ theme }) => theme.transitions.normal};

  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.mobile.small};

  background-color: ${({ theme, $isSunk }) =>
    $isSunk ? theme.colors.hit : theme.colors.water};
  text-decoration: ${({ $isSunk }) => ($isSunk ? "line-through" : "none")};
  opacity: ${({ $isSunk }) => ($isSunk ? 0.7 : 1)};

  ${({ $isSunk }) =>
    $isSunk &&
    `
    animation: shipSunk 0.5s ease-out;
  `}

  @media (min-width: ${({ theme }) => theme.breakpoints.mobileLarge}) {
    font-size: ${({ theme }) => theme.typography.mobile.body};
    padding: ${({ theme }) => theme.spacing.sm}
      ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
    padding: ${({ theme }) => theme.spacing.sm}
      ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.body};
  }

  @keyframes shipSunk {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.9);
      background-color: ${({ theme }) => theme.colors.hitGlow};
    }
    100% {
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
