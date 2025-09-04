import React, { useCallback } from 'react';
import styled from 'styled-components';
import DraggableShip from './DraggableShip';
import type { TwoPlayerShip, ShipPlacementData } from '../../types/twoPlayerGame';
import { SHIP_PLACEMENT_DATA } from '../../types/twoPlayerGame';

interface ShipSelectorProps {
  unplacedShips: TwoPlayerShip[];
  placedShips: TwoPlayerShip[];
}

const ShipSelector: React.FC<ShipSelectorProps> = ({
  unplacedShips,
  placedShips,
}) => {
  const getShipAssetData = useCallback((shipName: string): ShipPlacementData | undefined => {
    return SHIP_PLACEMENT_DATA.find(data => data.name === shipName);
  }, []);

  const renderShip = (ship: TwoPlayerShip, isPlaced: boolean) => {
    const assetData = getShipAssetData(ship.name);

    return (
      <DraggableShip
        key={ship.name}
        ship={ship}
        assetData={assetData}
        isPlaced={isPlaced}
      />
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