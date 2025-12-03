import React, { useState } from 'react';
import {
  CanvasContainer,
  RoomsGrid,
  RoomSlot,
  SyncIndicator
} from './RoomCanvas.styles';
import { getRoomComponent, DefaultRoomRenderer } from '../../../utils/RoomRegistry.jsx';
import { roomConfig } from '../../../utils/roomPositions';
import { roomColors } from '../../../utils/assetMapping';
import NavigationArrows from '../../navigation/NavigationArrows';
import useKeyboardNavigation from '../../../hooks/useKeyboardNavigation';
import { useSyncStatus } from '../../../contexts/SyncContext';

/**
 * Conteneur principal pour la navigation entre les pièces
 * @renders CanvasContainer
 * @renders RoomsGrid
 * @renders RoomSlot
 * @renders DefaultRoomRenderer
 * @renders AtelierRoom
 * @renders BibliothequeRoom
 * @renders BoutiqueRoom
 * @renders CaveRoom
 * @renders ChambreRoom
 * @renders ComptoirRoom
 * @renders CuisineRoom
 * @renders ForgeRoom
 * @renders JardinRoom
 * @renders LaboratoireRoom
 * @renders SanctuaireRoom
 * @renders ScriptoriumRoom
 * @renders NavigationArrows
 */
const RoomCanvas = ({ roomNavHook }) => {
  const { currentRoom, navigateToRoom, getAvailableDirections } = roomNavHook;
  const availableDirections = getAvailableDirections();
  const { syncStatus, isConfigured } = useSyncStatus();

  // État pour tracker la navigation
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeDirection, setActiveDirection] = useState(null);

  // Helper pour afficher l'icône et texte du sync
  const getSyncDisplay = () => {
    if (!isConfigured) return { icon: '⚠️', text: 'No sync' };

    switch (syncStatus) {
      case 'syncing':
        return { icon: '🔄', text: 'Syncing' };
      case 'pending':
        return { icon: '⏳', text: 'Pending' };
      case 'success':
        return { icon: '✓', text: 'Synced' };
      case 'error':
        return { icon: '✗', text: 'Error' };
      case 'offline':
        return { icon: '📴', text: 'Offline' };
      default:
        return { icon: '☁️', text: 'Ready' };
    }
  };

  const syncDisplay = getSyncDisplay();

  // Calcul pour centrer la pièce courante dans le viewport
  // Chaque pièce fait 16.67% de la largeur totale (100%/6) et 20% de la hauteur totale (100%/5)
  const translateX = -currentRoom.x * 16.67; // 100% / 6 colonnes = 16.67%
  const translateY = -currentRoom.y * 20; // 100% / 5 rangées = 20%

  // Fonction pour gérer la navigation avec animation
  const handleNavigation = (direction) => {
    if (!isNavigating && availableDirections[direction]) {
      setIsNavigating(true);
      setActiveDirection(direction);
      navigateToRoom(direction);

      // Reset après la durée de transition (400ms de la grille + 100ms de marge)
      setTimeout(() => {
        setIsNavigating(false);
        setActiveDirection(null);
      }, 500);
    }
  };

  // Gestion des raccourcis clavier via hook dédié
  useKeyboardNavigation({
    onNavigate: handleNavigation,
    availableDirections,
    isNavigating,
    enabled: true,
    currentPosition: currentRoom,
    stepDelayMs: 520,
    enableEscapeToDefault: true
  });

  // Créer la grille complète 6x5
  const fullGrid = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 6; x++) {
      // Chercher si une pièce existe à cette position
      const room = roomConfig.find(r => r.x === x && r.y === y);
      fullGrid.push({ x, y, room });
    }
  }

  return (
    <CanvasContainer id="room-canvas-container">
      {/* Indicateur de sync en haut à gauche */}
      <SyncIndicator $status={syncStatus} title={`Sync: ${syncStatus}`}>
        <span className="sync-icon">{syncDisplay.icon}</span>
        <span className="sync-text">{syncDisplay.text}</span>
      </SyncIndicator>

      <RoomsGrid style={{ transform: `translate(${translateX}%, ${translateY}%)` }}>
        {fullGrid.map((cell, index) => (
          <RoomSlot
            key={index}
            roomType={cell.room?.type || 'empty'}
            background={cell.room?.background || null}
            roomColors={roomColors}
          >
            {cell.room ? (() => {
              const RoomComponent = getRoomComponent(cell.room.type);

              // Si c'est le composant par défaut, passer les props room
              if (RoomComponent === DefaultRoomRenderer) {
                return <RoomComponent room={cell.room} />;
              }

              // Sinon, c'est un vrai composant Room
              return <RoomComponent />;
            })() : null}
          </RoomSlot>
        ))}
      </RoomsGrid>

      {/* Flèches de navigation dorées */}
      <NavigationArrows
        availableDirections={availableDirections}
        onNavigate={handleNavigation}
        size="50px"
        isNavigating={isNavigating}
        activeDirection={activeDirection}
      />
    </CanvasContainer>
  );
};

export default RoomCanvas;
