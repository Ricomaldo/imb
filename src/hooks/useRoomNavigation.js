// hooks/useRoomNavigation.js

import { useState } from 'react';
import { getAdjacentRooms, roomExistsAt } from '../utils/roomPositions';
import usePreferencesStore from '../stores/usePreferencesStore';

export const useRoomNavigation = () => {
  const defaultRoom = usePreferencesStore((state) => state.defaultRoom);
  const [currentRoom, setCurrentRoom] = useState(defaultRoom);

  const navigateToRoom = (direction) => {
    const adjacentRooms = getAdjacentRooms(currentRoom);
    const targetRoom = adjacentRooms[direction];

    if (roomExistsAt(targetRoom)) {
      setCurrentRoom(targetRoom);
    }
  };

  const getAvailableDirections = () => {
    const adjacent = getAdjacentRooms(currentRoom);
    return {
      up: roomExistsAt(adjacent.up),
      down: roomExistsAt(adjacent.down),
      left: roomExistsAt(adjacent.left),
      right: roomExistsAt(adjacent.right)
    };
  };

  return {
    currentRoom,
    navigateToRoom,
    getAvailableDirections
  };
};
