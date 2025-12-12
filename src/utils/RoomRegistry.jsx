// src/utils/RoomRegistry.jsx
// Auto-découverte des composants Room

/* eslint-disable react-refresh/only-export-components */

// Import de tous les composants Room
import AtelierRoom from '../components/rooms/Atelier/AtelierRoom';
import SanctuaireRoom from '../components/rooms/Sanctuaire/SanctuaireRoom';
import CuisineRoom from '../components/rooms/Cuisine/CuisineRoom';
import JardinRoom from '../components/rooms/Jardin/JardinRoom';
import BoutiqueRoom from '../components/rooms/Boutique/BoutiqueRoom';
import ChambreRoom from '../components/rooms/Chambre/ChambreRoom';
import ComptoirRoom from '../components/rooms/Comptoir/ComptoirRoom';
import ForgeRoom from '../components/rooms/Forge/ForgeRoom';
import ScriptoriumRoom from '../components/rooms/Scriptorium/ScriptoriumRoom';
import BibliothequeRoom from '../components/rooms/Bibliotheque/BibliothequeRoom';
import CaveRoom from '../components/rooms/Cave/CaveRoom';
import LaboratoireRoom from '../components/rooms/Laboratoire/LaboratoireRoom';
import RoomNote from '../components/dev/RoomNote/RoomNote';

// Registry des composants Room
export const RoomRegistry = {
  sanctuaire: SanctuaireRoom,
  chambre: ChambreRoom,
  cuisine: CuisineRoom,
  comptoir: ComptoirRoom,
  jardin: JardinRoom,
  atelier: AtelierRoom,
  forge: ForgeRoom,
  boutique: BoutiqueRoom,
  scriptorium: ScriptoriumRoom,
  bibliotheque: BibliothequeRoom,
  cave: CaveRoom,
  laboratoire: LaboratoireRoom,
};

// Composant par défaut pour les rooms non définies
export const DefaultRoomRenderer = ({ room }) => (
  <>
    {room.name}
    {room.type !== 'empty' && room.type !== 'undefined' && (
      <RoomNote roomType={room.type} />
    )}
  </>
);

// Helper pour récupérer le composant Room
export const getRoomComponent = (roomType) => {
  return RoomRegistry[roomType] || DefaultRoomRenderer;
};