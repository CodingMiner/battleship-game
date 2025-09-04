import React, { useCallback } from 'react';
import styled from 'styled-components';
import type { TwoPlayerShip, ShipPlacementData } from '../../types/twoPlayerGame';
import { SHIP_PLACEMENT_DATA } from '../../types/twoPlayerGame';

interface ShipSelectorProps {
  unplacedShips: TwoPlayerShip[];
  placedShips: TwoPlayerShip[];
  onDragStart: (shipName: string) => void;
  onDragEnd: () => void;
  draggedShip: string | null;
}

const ShipSelector: React.FC<ShipSelectorProps> = ({
  unplacedShips,
  placedShips,
  onDragStart,
  onDragEnd,
  draggedShip,
}) => {
  const getShipAssetData = useCallback((shipName: string): ShipPlacementData | undefined => {
    return SHIP_PLACEMENT_DATA.find(data => data.name === shipName);
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, ship: TwoPlayerShip) => {
    e.dataTransfer.setData('text/plain', ship.name);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(ship.name);
  }, [onDragStart]);

  const handleDragEnd = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  const renderShip = (ship: TwoPlayerShip, isPlaced: boolean) => {
    const assetData = getShipAssetData(ship.name);
    const isDragging = draggedShip === ship.name;

    return (
      <ShipItem
        key={ship.name}
        $isPlaced={isPlaced}
        $isDragging={isDragging}
        draggable={!isPlaced}
        onDragStart={(e) => !isPlaced && handleDragStart(e, ship)}
        onDragEnd={handleDragEnd}
        title={
          isPlaced 
            ? `${ship.name} (${ship.size} cells) - Placed`
            : `${ship.name} (${ship.size} cells) - Drag to place`
        }
      >
        <ShipImage
          src={assetData?.assetPath}
          alt={`${ship.name} ship`}
          $orientation={ship.orientation}
          $isPlaced={isPlaced}
        />
        <ShipInfo>
          <ShipName>{ship.name}</ShipName>
          <ShipSize>{ship.size} cells</ShipSize>
          {isPlaced && <PlacedIndicator>✓ Placed</PlacedIndicator>}
        </ShipInfo>
      </ShipItem>
    );
  };

  return (
    <SelectorContainer>
      <SelectorHeader>
        <Title>Fleet</Title>
        <Progress>
          {placedShips.length} / {unplacedShips.length + placedShips.length} ships placed
        </Progress>
      </SelectorHeader>
      
      <ShipsList>
        <SectionTitle>Available Ships</SectionTitle>
        {unplacedShips.map(ship => renderShip(ship, false))}
        
        {placedShips.length > 0 && (
          <>
            <SectionTitle>Placed Ships</SectionTitle>
            {placedShips.map(ship => renderShip(ship, true))}
          </>
        )}
      </ShipsList>
      
      <Instructions>
        <InstructionText>
          Drag ships to the board to place them
        </InstructionText>
        {unplacedShips.length > 0 && (
          <InstructionText>
            {unplacedShips.length} ship{unplacedShips.length !== 1 ? 's' : ''} remaining
          </InstructionText>
        )}
      </Instructions>
    </SelectorContainer>
  );
};

export default ShipSelector;

const SelectorContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  padding: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 280px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: 320px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    max-width: 360px;
  }
`;

const SelectorHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.mobile.subtitle};
  font-weight: bold;
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.subtitle};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.subtitle};
  }
`;

const Progress = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.mobile.small};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
  }
`;

const ShipsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionTitle = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: 600;
  margin: ${({ theme }) => theme.spacing.sm} 0 ${({ theme }) => theme.spacing.xs} 0;
  
  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }
`;

const ShipItem = styled.div<{ $isPlaced: boolean; $isDragging: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.background};
  
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: ${({ $isPlaced }) => $isPlaced ? 'default' : 'grab'};
  opacity: ${({ $isDragging, $isPlaced }) => {
    if ($isDragging) return 0.5;
    if ($isPlaced) return 0.7;
    return 1;
  }};
  
  &:hover {
    ${({ $isPlaced, theme }) => !$isPlaced && `
      background-color: ${theme.colors.backgroundDark};
      border-color: ${theme.colors.borderActive};
      transform: translateY(-1px);
      box-shadow: ${theme.shadows.medium};
    `}
  }
  
  &:active {
    cursor: ${({ $isPlaced }) => $isPlaced ? 'default' : 'grabbing'};
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

const ShipImage = styled.img<{ $orientation: string; $isPlaced: boolean }>`
  width: 40px;
  height: auto;
  max-height: 24px;
  object-fit: contain;
  
  transform: ${({ $orientation }) => 
    $orientation === 'vertical' ? 'rotate(90deg)' : 'none'
  };
  
  filter: ${({ $isPlaced }) => 
    $isPlaced ? 'grayscale(0.5) opacity(0.8)' : 'none'
  };
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 48px;
    max-height: 28px;
  }
`;

const ShipInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ShipName = styled.div`
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-transform: capitalize;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }
`;

const ShipSize = styled.div`
  font-size: ${({ theme }) => theme.typography.mobile.small};
  color: ${({ theme }) => theme.colors.textLight};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
  }
`;

const PlacedIndicator = styled.div`
  font-size: ${({ theme }) => theme.typography.mobile.small};
  color: ${({ theme }) => theme.colors.success};
  font-weight: 600;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
  }
`;

const Instructions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const InstructionText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.mobile.small};
  margin: ${({ theme }) => theme.spacing.xs} 0;
  line-height: 1.4;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
  }
`;