import React from 'react';
import styled from 'styled-components';
import ShipPlacementBoard from './ShipPlacementBoard';
import ShipSelector from './ShipSelector';
import PlacementControls from './PlacementControls';
import type { 
  TwoPlayerShip, 
  ShipOrientation, 
  PlacementValidation,
  AIDifficulty
} from '../../types/twoPlayerGame';
import type { Position } from '../../types';

interface ShipPlacementPhaseProps {
  ships: TwoPlayerShip[];
  placedShips: TwoPlayerShip[];
  unplacedShips: TwoPlayerShip[];
  canStartBattle: boolean;
  draggedShip: string | null;
  difficulty: AIDifficulty;
  onShipPlace: (shipName: string, position: Position, orientation: ShipOrientation) => PlacementValidation;
  onShipRemove: (shipName: string) => void;
  onAutoPlaceShips: () => void;
  onShipRotate: (shipName: string) => void;
  onDifficultyChange: (difficulty: AIDifficulty) => void;
  onStartBattle: () => void;
  onResetPlacement: () => void;
  onDragStart: (shipName: string) => void;
  onDragEnd: () => void;
}

const ShipPlacementPhase: React.FC<ShipPlacementPhaseProps> = ({
  ships,
  placedShips,
  unplacedShips,
  canStartBattle,
  draggedShip,
  difficulty,
  onShipPlace,
  onShipRemove,
  onAutoPlaceShips,
  onShipRotate,
  onDifficultyChange,
  onStartBattle,
  onResetPlacement,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <PlacementContainer>
      <PhaseHeader>
        <Title>Fleet Deployment</Title>
        <Subtitle>
          Position your ships strategically on the battlefield
        </Subtitle>
        <DifficultySelector>
          <DifficultyLabel>AI Difficulty:</DifficultyLabel>
          <DifficultyButtons>
            {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((level) => (
              <DifficultyButton
                key={level}
                $active={difficulty === level}
                onClick={() => onDifficultyChange(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </DifficultyButton>
            ))}
          </DifficultyButtons>
        </DifficultySelector>
      </PhaseHeader>
      
      <ContentLayout>
        <BoardSection>
          <ShipPlacementBoard
            ships={ships}
            onShipPlace={onShipPlace}
            onShipRemove={onShipRemove}
            onShipRotate={onShipRotate}
            draggedShip={draggedShip}
            onDragEnd={onDragEnd}
          />
        </BoardSection>
        
        <SidebarSection>
          <ShipSelector
            unplacedShips={unplacedShips}
            placedShips={placedShips}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggedShip={draggedShip}
          />
        </SidebarSection>
      </ContentLayout>
      
      <ControlsSection>
        <PlacementControls
          canStartBattle={canStartBattle}
          hasUnplacedShips={unplacedShips.length > 0}
          onStartBattle={onStartBattle}
          onAutoPlaceShips={onAutoPlaceShips}
          onResetPlacement={onResetPlacement}
          placedShipsCount={placedShips.length}
          totalShipsCount={ships.length}
        />
      </ControlsSection>
    </PlacementContainer>
  );
};

export default ShipPlacementPhase;

const PlacementContainer = styled.div`
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
    gap: ${({ theme }) => theme.spacing.xxl};
  }
`;

const PhaseHeader = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
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

const ContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 1200px;
  align-items: center;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.xxl};
  }
`;

const BoardSection = styled.section`
  display: flex;
  justify-content: center;
  width: 100%;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: auto;
    flex-shrink: 0;
  }
`;

const SidebarSection = styled.aside`
  display: flex;
  justify-content: center;
  width: 100%;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: auto;
    flex-shrink: 0;
  }
`;

const ControlsSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const DifficultySelector = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const DifficultyLabel = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: 500;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }
`;

const DifficultyButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const DifficultyButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  background-color: ${({ theme, $active }) => 
    $active ? theme.colors.water : theme.colors.background};
  color: ${({ theme, $active }) => 
    $active ? theme.colors.white : theme.colors.text};
  font-size: ${({ theme }) => theme.typography.mobile.small};
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-height: ${({ theme }) => theme.touch.minTarget};
  
  &:hover {
    background-color: ${({ theme, $active }) => 
      $active ? theme.colors.waterHover : theme.colors.backgroundDark};
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.borderActive};
    outline-offset: -2px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  }
  
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:active {
      transform: none;
    }
  }
`;