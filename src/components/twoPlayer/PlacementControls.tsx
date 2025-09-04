import React from 'react';
import styled from 'styled-components';

interface PlacementControlsProps {
  canStartBattle: boolean;
  hasUnplacedShips: boolean;
  onStartBattle: () => void;
  onAutoPlaceShips: () => void;
  onResetPlacement: () => void;
  placedShipsCount: number;
  totalShipsCount: number;
}

const PlacementControls: React.FC<PlacementControlsProps> = ({
  canStartBattle,
  hasUnplacedShips,
  onStartBattle,
  onAutoPlaceShips,
  onResetPlacement,
  placedShipsCount,
  totalShipsCount,
}) => {
  return (
    <ControlsContainer>
      <StatusSection>
        <StatusText>
          Fleet Status: {placedShipsCount}/{totalShipsCount} ships placed
        </StatusText>
        <ProgressBar>
          <ProgressFill $progress={(placedShipsCount / totalShipsCount) * 100} />
        </ProgressBar>
      </StatusSection>
      
      <ButtonSection>
        <SecondaryButton
          onClick={onResetPlacement}
          title="Remove all ships and start over"
        >
          Reset All
        </SecondaryButton>
        
        {hasUnplacedShips && (
          <SecondaryButton
            onClick={onAutoPlaceShips}
            title="Automatically place all remaining ships"
          >
            ⚡ Auto Place
          </SecondaryButton>
        )}
        
        <PrimaryButton
          onClick={onStartBattle}
          disabled={!canStartBattle}
          title={
            canStartBattle 
              ? "Start the battle!" 
              : `Place ${totalShipsCount - placedShipsCount} more ship${totalShipsCount - placedShipsCount !== 1 ? 's' : ''} to continue`
          }
        >
          {canStartBattle ? '🚀 Start Battle!' : `${totalShipsCount - placedShipsCount} Ships Remaining`}
        </PrimaryButton>
      </ButtonSection>
      
      <HelpSection>
        <HelpText>
          💡 <strong>Quick Tips:</strong>
        </HelpText>
        <HelpText>
          • Drag ships from the fleet to the board
        </HelpText>
        <HelpText>
          • Left click placed ships to rotate them
        </HelpText>
        <HelpText>
          • Right click placed ships to remove them
        </HelpText>
      </HelpSection>
    </ControlsContainer>
  );
};

export default PlacementControls;

const ControlsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 100%;
  
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: 600px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    max-width: 700px;
  }
`;

const StatusSection = styled.div`
  text-align: center;
`;

const StatusText = styled.div`
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.body};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.success}, 
    ${({ theme }) => theme.colors.successLight}
  );
  transition: width ${({ theme }) => theme.transitions.normal};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const ButtonSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: center;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const BaseButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: bold;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  min-height: ${({ theme }) => theme.touch.minTarget};
  min-width: 120px;
  
  &:hover:not(:disabled) {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.small};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: ${({ theme }) => theme.shadows.small} !important;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.borderActive};
    outline-offset: 2px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
    min-width: 140px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.body};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:hover:not(:disabled) {
      transform: none;
    }

    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

const PrimaryButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.white};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.successLight};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.textLight};
  }
`;

const SecondaryButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.border};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.backgroundDark};
    border-color: ${({ theme }) => theme.colors.borderActive};
  }
`;

const HelpSection = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const HelpText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.mobile.small};
  margin: ${({ theme }) => theme.spacing.xs} 0;
  line-height: 1.4;
  
  &:first-child {
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.small};
  }
`;