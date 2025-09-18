import React from 'react';
import styled from 'styled-components';
import type { TwoPlayerGameState, Player } from '../../types/twoPlayerGame';

interface BattleStatusProps {
  gameState: TwoPlayerGameState;
  battleMessage: string;
  currentTurn: Player;
}

const BattleStatus: React.FC<BattleStatusProps> = ({
  gameState,
  battleMessage,
  currentTurn
}) => {
  const playerStats = {
    shipsRemaining: gameState.playerBoard.ships.filter(ship => !ship.isSunk).length,
    totalShips: gameState.playerBoard.ships.length,
    accuracy: gameState.totalShots.player > 0 
      ? Math.round((gameState.hits.player / gameState.totalShots.player) * 100) 
      : 0
  };

  const computerStats = {
    shipsRemaining: gameState.computerBoard.ships.filter(ship => !ship.isSunk).length,
    totalShips: gameState.computerBoard.ships.length,
    accuracy: gameState.totalShots.computer > 0 
      ? Math.round((gameState.hits.computer / gameState.totalShots.computer) * 100) 
      : 0
  };

  const getMessageType = (): 'player' | 'computer' | 'victory' | 'defeat' | 'neutral' => {
    if (gameState.phase === 'gameOver') {
      return gameState.winner === 'player' ? 'victory' : 'defeat';
    }
    
    if (battleMessage.includes('Victory') || battleMessage.includes('🎉')) {
      return 'victory';
    }
    
    if (battleMessage.includes('Defeat') || battleMessage.includes('💥')) {
      return 'defeat';
    }
    
    if (currentTurn === 'player' || battleMessage.includes('Your turn')) {
      return 'player';
    }
    
    if (currentTurn === 'computer' || battleMessage.includes('Computer')) {
      return 'computer';
    }
    
    return 'neutral';
  };

  return (
    <StatusContainer>
      <TurnIndicator $currentTurn={currentTurn}>
        <TurnText>
          {gameState.phase === 'gameOver' 
            ? 'Game Over!' 
            : `${currentTurn === 'player' ? 'Your Turn' : 'Computer\'s Turn'}`
          }
        </TurnText>
      </TurnIndicator>
      
      <MessageContainer>
        <BattleMessage $messageType={getMessageType()}>
          {battleMessage || "Battle in progress..."}
        </BattleMessage>
      </MessageContainer>
      
      <StatsContainer>
        <PlayerStats>
          <StatsTitle>Your Fleet</StatsTitle>
          <StatsList>
            <StatItem>
              <StatLabel>Ships:</StatLabel>
              <StatValue>{playerStats.shipsRemaining}/{playerStats.totalShips}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Shots:</StatLabel>
              <StatValue>{gameState.totalShots.player}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Hits:</StatLabel>
              <StatValue>{gameState.hits.player}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Accuracy:</StatLabel>
              <StatValue>{playerStats.accuracy}%</StatValue>
            </StatItem>
          </StatsList>
        </PlayerStats>
        
        <Divider />
        
        <ComputerStats>
          <StatsTitle>Enemy Fleet</StatsTitle>
          <StatsList>
            <StatItem>
              <StatLabel>Ships:</StatLabel>
              <StatValue>{computerStats.shipsRemaining}/{computerStats.totalShips}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Shots:</StatLabel>
              <StatValue>{gameState.totalShots.computer}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Hits:</StatLabel>
              <StatValue>{gameState.hits.computer}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Accuracy:</StatLabel>
              <StatValue>{computerStats.accuracy}%</StatValue>
            </StatItem>
          </StatsList>
        </ComputerStats>
      </StatsContainer>
    </StatusContainer>
  );
};

export default BattleStatus;

const StatusContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 600px;
  
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TurnIndicator = styled.div<{ $currentTurn: Player }>`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme, $currentTurn }) => 
    $currentTurn === 'player' ? theme.colors.success : theme.colors.warning
  };
  
  transition: all ${({ theme }) => theme.transitions.normal};
`;

const TurnText = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.body};
  }
`;

const MessageContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
`;

const BattleMessage = styled.div<{ 
  $messageType: 'player' | 'computer' | 'victory' | 'defeat' | 'neutral' 
}>`
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: 600;
  line-height: 1.4;
  
  color: ${({ theme, $messageType }) => {
    switch ($messageType) {
      case 'victory': return theme.colors.success;
      case 'defeat': return theme.colors.error;
      case 'player': return theme.colors.borderActive;
      case 'computer': return theme.colors.warning;
      default: return theme.colors.text;
    }
  }};
  
  ${({ $messageType }) => ($messageType === 'victory' || $messageType === 'defeat') && `
    font-size: 1.1em;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  `}
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.body};
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const PlayerStats = styled.div`
  flex: 1;
`;

const ComputerStats = styled.div`
  flex: 1;
`;

const StatsTitle = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: bold;
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  text-align: center;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.mobile.small};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
  }
`;

const StatValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: 600;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }
`;

const Divider = styled.div`
  width: 2px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 1px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    height: 2px;
  }
`;