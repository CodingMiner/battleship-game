import React from 'react';
import styled from 'styled-components';
import BattleGrid from './BattleGrid';
import BattleStatus from './BattleStatus';
import type { TwoPlayerGameState, Player } from '../../types/twoPlayerGame';
import type { Position } from '../../types';

interface BattlePhaseProps {
  gameState: TwoPlayerGameState;
  currentTurn: Player;
  battleMessage: string;
  onAttackComputer: (position: Position) => void;
  onResetGame: () => void;
}

const BattlePhase: React.FC<BattlePhaseProps> = ({
  gameState,
  currentTurn,
  battleMessage,
  onAttackComputer,
  onResetGame
}) => {
  const isPlayerTurn = currentTurn === 'player' && gameState.phase === 'battle';

  return (
    <BattleContainer>
      <BattleHeader>
        <Title>⚔️ Naval Battle</Title>
        <Subtitle>
          Engage the enemy fleet in tactical warfare
        </Subtitle>
      </BattleHeader>
      
      <BattleStatus 
        gameState={gameState}
        battleMessage={battleMessage}
        currentTurn={currentTurn}
      />
      
      <BattleContent>
        <BoardSection>
          <BattleGrid
            attackBoard={gameState.playerAttacks}
            ships={[]} // Don't show enemy ships
            onCellClick={onAttackComputer}
            disabled={!isPlayerTurn}
            isPlayerBoard={false}
            title="Enemy Waters"
          />
        </BoardSection>
        
        <VSIndicator>
          <VSText>VS</VSText>
        </VSIndicator>
        
        <BoardSection>
          <BattleGrid
            attackBoard={gameState.computerAttacks}
            ships={gameState.playerBoard.ships}
            disabled={true}
            isPlayerBoard={true}
            title="Your Fleet"
          />
        </BoardSection>
      </BattleContent>
      
      {gameState.phase === 'gameOver' && (
        <GameOverSection>
          <GameOverCard>
            <GameOverTitle>
              {gameState.winner === 'player' ? '🎉 Victory!' : '💥 Defeat!'}
            </GameOverTitle>
            <GameOverMessage>
              {gameState.winner === 'player' 
                ? 'Congratulations! You sank all enemy ships!'
                : 'The enemy destroyed your entire fleet!'
              }
            </GameOverMessage>
            <ActionButtons>
              <PlayAgainButton onClick={onResetGame}>
                ⚓ Play Again
              </PlayAgainButton>
            </ActionButtons>
          </GameOverCard>
        </GameOverSection>
      )}
    </BattleContainer>
  );
};

export default BattlePhase;

const BattleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const BattleHeader = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.mobile.title};
  font-weight: bold;
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  line-height: 1.2;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.title};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.title};
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  margin: 0;
  line-height: 1.4;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.body};
  }
`;

const BattleContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 1200px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xxl};
  }
`;

const BoardSection = styled.section`
  display: flex;
  justify-content: center;
`;

const VSIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    flex-direction: column;
    height: 100%;
  }
`;

const VSText = styled.div`
  background-color: ${({ theme }) => theme.colors.warning};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.mobile.subtitle};
  font-weight: bold;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.subtitle};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.subtitle};
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
`;

const GameOverSection = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const GameOverCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  max-width: 400px;
  width: 100%;
  
  animation: gameOverSlide 0.5s ease-out;
  
  @keyframes gameOverSlide {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const GameOverTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.tablet.title};
  font-weight: bold;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.title};
  }
`;

const GameOverMessage = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  line-height: 1.5;
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
`;

const PlayAgainButton = styled.button`
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
  min-width: 160px;

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
    min-width: 180px;
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