// src/components/room-modules/chambre/NavigationGrid.jsx

import React from 'react';
import styled from 'styled-components';
import { roomConfig } from '../../../utils/roomPositions';
import { roomColors } from '../../../utils/assetMapping';
import usePreferencesStore from '../../../stores/usePreferencesStore';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing['2xs']};
  width: 100%;
  height: 100%;
  padding: ${props => props.theme.spacing.xs};
  place-items: center;
  box-sizing: border-box;
  overflow: hidden;
`;

const RoomCell = styled.div`
  background-color: ${props => props.color};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radii.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.sizes.sm};
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;
  opacity: ${props => props.$isCurrent ? 1 : 0.8};
  box-shadow: ${props => props.$isCurrent ? `0 0 8px ${props.color}` : '0 2px 4px rgba(0,0,0,0.2)'};
  width: 90%;
  height: 90%;
  aspect-ratio: 1.5;

  &:hover {
    opacity: 1;
    transform: scale(1.08);
    box-shadow: 0 0 12px ${props => props.color};
    z-index: 1;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const RoomLabel = styled.span`
  color: ${props => props.theme.colors.text.light};
  text-shadow: 0 1px 3px rgba(0,0,0,0.7);
  line-height: 1.2;
  font-family: ${props => props.theme.typography.families.primary};
`;

/**
 * Grille de navigation pour accéder rapidement aux différentes rooms
 * @renders GridContainer
 * @renders RoomCell
 * @renders RoomLabel
 */
const NavigationGrid = () => {
  const { defaultRoom } = usePreferencesStore();

  const handleRoomClick = async (roomType) => {
    const targetRoom = roomConfig.find(r => r.type === roomType);
    if (!targetRoom) return;

    const currentPos = defaultRoom;
    if (currentPos.x === targetRoom.x && currentPos.y === targetRoom.y) return;

    console.log(`🧭 Navigation vers: ${roomType} (${targetRoom.x}, ${targetRoom.y})`);

    // Fonction helper pour cliquer sur une flèche (comme dans capture-state.js)
    const clickArrow = async (direction) => {
      const selectors = [
        `button[aria-label="Navigate ${direction}"]`,
        `button[title="Navigate ${direction}"]`,
        `[aria-label="Navigate ${direction}"]`
      ];

      // Debug: voir quelles flèches sont disponibles
      const allArrows = document.querySelectorAll('button[aria-label*="Navigate"]');
      console.log(`🔍 Flèches disponibles:`, Array.from(allArrows).map(el => el.getAttribute('aria-label')));

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          console.log(`✓ Trouvé: ${selector}, disabled: ${element.disabled}`);
          if (!element.disabled) {
            element.click();
            return true;
          } else {
            console.warn(`⚠️ Flèche ${direction} trouvée mais désactivée`);
            return false;
          }
        }
      }
      console.warn(`⚠️ Impossible de trouver la flèche ${direction}`);
      return false;
    };

    // Navigation pas-à-pas avec stratégie spéciale pour rangées 1 et 2
    const navigateStepByStep = async () => {
      let current = { ...currentPos };
      let steps = 0;
      const maxSteps = 15; // Plus d'étapes pour la stratégie 3-phases

      console.log(`🧭 Début navigation: (${current.x}, ${current.y}) → (${targetRoom.x}, ${targetRoom.y})`);

      // Stratégie spéciale pour rangées 1 et 2 (via atelier)
      const isTargetingRow1or2 = targetRoom.y >= 1;
      const atelierPos = { x: 1, y: 1 }; // Position de l'atelier (hub central)

      while ((current.x !== targetRoom.x || current.y !== targetRoom.y) && steps < maxSteps) {
        let direction = null;

        if (isTargetingRow1or2 && current.y === 0) {
          // Phase 1: Depuis rangée 0, aller d'abord à l'atelier
          console.log(`🎯 Phase 1: Direction atelier (${atelierPos.x}, ${atelierPos.y})`);
          if (current.x < atelierPos.x) direction = 'right';
          else if (current.x > atelierPos.x) direction = 'left';
          else if (current.y < atelierPos.y) direction = 'down';
        } else if (targetRoom.y === 2 && current.y === 1 && current.x !== targetRoom.x) {
          // Phase 2: Pour rangée 2, se positionner sur la bonne colonne depuis l'atelier
          console.log(`🎯 Phase 2: Positionnement colonne ${targetRoom.x} en rangée 1`);
          if (current.x < targetRoom.x) direction = 'right';
          else if (current.x > targetRoom.x) direction = 'left';
        } else {
          // Phase 3: Navigation normale (X puis Y)
          if (current.x < targetRoom.x) direction = 'right';
          else if (current.x > targetRoom.x) direction = 'left';
          else if (current.y < targetRoom.y) direction = 'down';
          else if (current.y > targetRoom.y) direction = 'up';
        }

        if (direction) {
          console.log(`🔄 Étape ${steps + 1}: ${direction} depuis (${current.x}, ${current.y})`);
          const success = await clickArrow(direction);
          if (!success) {
            console.warn(`❌ Échec du clic ${direction}`);
            break;
          }
          
          // Mettre à jour la position locale pour le calcul suivant
          switch(direction) {
            case 'right': current.x++; break;
            case 'left': current.x--; break;
            case 'down': current.y++; break;
            case 'up': current.y--; break;
          }
          
          console.log(`✓ Nouvelle position: (${current.x}, ${current.y})`);
          steps++;
          
          // Attendre la transition (comme dans capture-state.js)
          await new Promise(resolve => setTimeout(resolve, 600));
        } else {
          console.log(`✅ Navigation terminée`);
          break;
        }
      }
      
      if (steps >= maxSteps) {
        console.warn(`⚠️ Navigation interrompue après ${maxSteps} étapes`);
      }
    };

    navigateStepByStep();
  };

  const getCurrentRoomType = () => {
    return roomConfig.find(room => 
      room.x === defaultRoom.x && room.y === defaultRoom.y
    )?.type || 'atelier';
  };

  const currentRoomType = getCurrentRoomType();

  // Créer seulement la grille centrale 4x3 des pièces actives
  const activeRooms = roomConfig.filter(room =>
    room.x >= 1 && room.x <= 4 &&
    room.y >= 1 && room.y <= 3
  );

  // Trier les pièces par position (y puis x) pour l'ordre correct dans la grille
  activeRooms.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  return (
    <GridContainer>
      {activeRooms.map((room) => (
        <RoomCell
          key={`${room.x}-${room.y}`}
          color={roomColors[room.type]}
          $isCurrent={room.type === currentRoomType}
          onClick={() => handleRoomClick(room.type)}
          title={`Aller vers ${room.name}`}
        >
          <RoomLabel>
            {room.name}
          </RoomLabel>
        </RoomCell>
      ))}
    </GridContainer>
  );
};

export default NavigationGrid;
