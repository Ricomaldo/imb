// hooks/useRoomNavigation.js

import { useState } from 'react';
import { getAdjacentRooms, isValidPosition } from '../utils/roomPositions';
import usePreferencesStore from '../stores/usePreferencesStore';

export const useRoomNavigation = () => {
  const defaultRoom = usePreferencesStore((state) => state.defaultRoom);
  const [currentRoom, setCurrentRoom] = useState(defaultRoom);

  const navigateToRoom = (direction) => {
    const adjacentRooms = getAdjacentRooms(currentRoom);
    const targetRoom = adjacentRooms[direction];

    if (isValidPosition(targetRoom)) {
      setCurrentRoom(targetRoom);
    }
  };

  const getAvailableDirections = () => {
    const adjacent = getAdjacentRooms(currentRoom);
    return {
      up: isValidPosition(adjacent.up),
      down: isValidPosition(adjacent.down),
      left: isValidPosition(adjacent.left),
      right: isValidPosition(adjacent.right)
    };
  };

  return {
    currentRoom,
    navigateToRoom,
    getAvailableDirections
  };
};
