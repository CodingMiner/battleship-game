import React from 'react';
import styled from 'styled-components';
import { useDraggable } from '@dnd-kit/core';
import type { TwoPlayerShip, ShipPlacementData } from '../../types/twoPlayerGame';

interface DraggableShipProps {
  ship: TwoPlayerShip;
  assetData: ShipPlacementData | undefined;
  isPlaced: boolean;
}

const DraggableShip: React.FC<DraggableShipProps> = ({ 
  ship, 
  assetData, 
  isPlaced 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: ship.name,
    disabled: isPlaced,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <ShipItem
      ref={setNodeRef}
      style={style}
      $isPlaced={isPlaced}
      $isDragging={isDragging}
      {...listeners}
      {...attributes}
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
        <ShipStatus $isPlaced={isPlaced}>
          {isPlaced ? '✅ Placed' : '📍 Drag to place'}
        </ShipStatus>
      </ShipInfo>
    </ShipItem>
  );
};

export default DraggableShip;

const ShipItem = styled.div<{ $isPlaced: boolean; $isDragging: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme, $isPlaced }) => 
    $isPlaced ? theme.colors.success : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme, $isPlaced, $isDragging }) => {
    if ($isDragging) return theme.colors.waterHover;
    if ($isPlaced) return theme.colors.successLight;
    return theme.colors.white;
  }};
  cursor: ${({ $isPlaced }) => $isPlaced ? 'default' : 'grab'};
  transition: all ${({ theme }) => theme.transitions.fast};
  opacity: ${({ $isDragging }) => $isDragging ? 0.5 : 1};
  box-shadow: ${({ theme, $isDragging }) => 
    $isDragging ? theme.shadows.large : theme.shadows.small};
  
  &:active {
    cursor: ${({ $isPlaced }) => $isPlaced ? 'default' : 'grabbing'};
  }

  &:hover:not([data-disabled]) {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:hover:not([data-disabled]) {
      transform: none;
    }
  }
`;

const ShipImage = styled.img<{ 
  $orientation: 'horizontal' | 'vertical'; 
  $isPlaced: boolean;
}>`
  width: ${({ $orientation }) => $orientation === 'horizontal' ? '60px' : '40px'};
  height: ${({ $orientation }) => $orientation === 'horizontal' ? '40px' : '60px'};
  object-fit: contain;
  opacity: ${({ $isPlaced }) => $isPlaced ? 0.6 : 1};
  filter: ${({ $isPlaced }) => $isPlaced ? 'grayscale(50%)' : 'none'};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: ${({ $orientation }) => $orientation === 'horizontal' ? '80px' : '50px'};
    height: ${({ $orientation }) => $orientation === 'horizontal' ? '50px' : '80px'};
  }
`;

const ShipInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
`;

const ShipName = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  text-transform: capitalize;
  line-height: 1.2;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }
`;

const ShipSize = styled.span`
  font-size: ${({ theme }) => theme.typography.mobile.small};
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 500;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
  }
`;

const ShipStatus = styled.span<{ $isPlaced: boolean }>`
  font-size: ${({ theme }) => theme.typography.mobile.small};
  color: ${({ theme, $isPlaced }) => 
    $isPlaced ? theme.colors.success : theme.colors.water};
  font-weight: 600;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.small};
  }
`;