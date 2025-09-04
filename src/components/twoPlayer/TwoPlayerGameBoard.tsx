import React from 'react';
import styled from 'styled-components';
import ShipPlacementPhase from './ShipPlacementPhase';
import BattlePhase from './BattlePhase';
import { useTwoPlayerGame } from '../../hooks/useTwoPlayerGame';

interface TwoPlayerGameBoardProps {
  difficulty?: import('../../types/twoPlayerGame').AIDifficulty;
}

const TwoPlayerGameBoard: React.FC<TwoPlayerGameBoardProps> = ({ 
  difficulty = 'medium' 
}) => {
  const {
    gameState,
    gamePhase,
    currentTurn,
    canStartBattle,
    placedShips,
    unplacedShips,
    battleMessage,
    difficulty: currentDifficulty,
    
    // Actions
    placePlayerShip,
    removePlayerShip,
    autoPlaceShips,
    rotatePlayerShip,
    updateDifficulty,
    startBattle,
    attackComputer,
    resetGame,
  } = useTwoPlayerGame(difficulty);

  const renderGamePhase = () => {
    switch (gamePhase) {
      case 'placement':
        return (
          <ShipPlacementPhase
            ships={gameState.playerBoard.ships}
            placedShips={placedShips}
            unplacedShips={unplacedShips}
            canStartBattle={canStartBattle}
            difficulty={currentDifficulty}
            onShipPlace={placePlayerShip}
            onShipRemove={removePlayerShip}
            onAutoPlaceShips={autoPlaceShips}
            onShipRotate={rotatePlayerShip}
            onDifficultyChange={updateDifficulty}
            onStartBattle={startBattle}
            onResetPlacement={resetGame}
          />
        );
        
      case 'battle':
      case 'gameOver':
        return (
          <BattlePhase
            gameState={gameState}
            currentTurn={currentTurn}
            battleMessage={battleMessage}
            onAttackComputer={attackComputer}
            onResetGame={resetGame}
          />
        );
        
      default:
        return (
          <ErrorContainer>
            <Title>Unknown Game Phase</Title>
            <BackButton onClick={resetGame}>
              Reset Game
            </BackButton>
          </ErrorContainer>
        );
    }
  };

  return (
    <GameContainer>
      {renderGamePhase()}
    </GameContainer>
  );
};

export default TwoPlayerGameBoard;

const GameContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.mobile.title};
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.title};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.title};
  }
`;

const BackButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: bold;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  min-height: ${({ theme }) => theme.touch.minTarget};
  min-width: 140px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.successLight};
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.small};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.borderActive};
    outline-offset: 2px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xxl};
    min-width: 160px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.body};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:hover {
      transform: none;
    }

    &:active {
      transform: none;
    }
  }
`;