// src/utils/roomPositions.js

import { roomBackgrounds } from './assetMapping';

// Configuration par défaut des pièces
// Grille 6x5 avec la maison 4x3 centrée (bordure d'une case de chaque côté)
const defaultRoomConfig = [
  // Ligne 1 (anciennement ligne 0): [Sanctuaire] [Chambre] [Scriptorium] [Comptoir]
  { x: 1, y: 1, type: 'sanctuaire', name: 'Sanctuaire', background: roomBackgrounds.sanctuaire },
  { x: 2, y: 1, type: 'chambre', name: 'Chambre', background: roomBackgrounds.chambre },
  { x: 3, y: 1, type: 'scriptorium', name: 'Scriptorium', background: roomBackgrounds.scriptorium },
  { x: 4, y: 1, type: 'comptoir', name: 'Comptoir', background: roomBackgrounds.comptoir },

  // Ligne 2 (anciennement ligne 1): [Cuisine] [ATELIER] [Forge] [Boutique]
  { x: 1, y: 2, type: 'cuisine', name: 'Cuisine', background: roomBackgrounds.cuisine },
  { x: 2, y: 2, type: 'atelier', name: 'Atelier', background: roomBackgrounds.atelier },
  { x: 3, y: 2, type: 'forge', name: 'Forge', background: roomBackgrounds.forge },
  { x: 4, y: 2, type: 'boutique', name: 'Boutique', background: roomBackgrounds.boutique },

  // Ligne 3 (anciennement ligne 2): [Laboratoire] [Bibliothèque] [Jardin] [Cave]
  { x: 1, y: 3, type: 'laboratoire', name: 'Laboratoire', background: roomBackgrounds.laboratoire },
  { x: 2, y: 3, type: 'bibliotheque', name: 'Bibliothèque', background: roomBackgrounds.bibliotheque },
  { x: 3, y: 3, type: 'jardin', name: 'Jardin', background: roomBackgrounds.jardin },
  { x: 4, y: 3, type: 'cave', name: 'Cave', background: roomBackgrounds.cave }
];

// Fonction pour obtenir la configuration des pièces
// Utilise la disposition personnalisée si elle existe, sinon la configuration par défaut
const getRoomConfig = () => {
  // Vérifier si une disposition personnalisée existe dans le store
  if (typeof window !== 'undefined') {
    try {
      const storedPrefs = localStorage.getItem('irim-preferences-store');
      if (storedPrefs) {
        const prefs = JSON.parse(storedPrefs);
        const customLayout = prefs?.state?.customRoomLayout;

        if (customLayout && Array.isArray(customLayout)) {
          // Pour la grille 5x6, on ne retourne que les pièces non-vides
          // en ajustant leurs positions si elles viennent de l'éditeur
          const rooms = customLayout
            .filter(room => room.type !== 'empty')
            .map(room => {
              const defaultRoom = defaultRoomConfig.find(r => r.type === room.type);
              if (!defaultRoom) {
                return null;
              }
              return {
                ...defaultRoom,
                x: room.x,
                y: room.y
              };
            })
            .filter(Boolean);

          // S'assurer qu'on a bien toutes les 12 pièces
          if (rooms.length === 12) {
            return rooms;
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la lecture de la disposition personnalisée:', error);
    }
  }

  return defaultRoomConfig;
};

// Export de roomConfig comme une fonction qui retourne la configuration actuelle
export const roomConfig = getRoomConfig();

export const getAdjacentRooms = (currentPos) => {
  return {
    up: currentPos.y > 0 ? { x: currentPos.x, y: currentPos.y - 1 } : null,
    down: currentPos.y < 4 ? { x: currentPos.x, y: currentPos.y + 1 } : null,
    left: currentPos.x > 0 ? { x: currentPos.x - 1, y: currentPos.y } : null,
    right: currentPos.x < 5 ? { x: currentPos.x + 1, y: currentPos.y } : null
  };
};

export const isValidPosition = (pos) => {
  return pos && pos.x >= 0 && pos.x <= 5 && pos.y >= 0 && pos.y <= 4;
};

// Vérifie si une pièce existe réellement à cette position
export const roomExistsAt = (pos) => {
  if (!pos) return false;
  const config = getRoomConfig();
  return config.some(room => room.x === pos.x && room.y === pos.y);
};
