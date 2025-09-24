// src/components/layout/BaseRoom/BaseRoom.jsx

import React from 'react';
import PropTypes from 'prop-types';
import RoomNote from '../../dev/RoomNote/RoomNote';
import { BaseRoomContainer } from './BaseRoom.styles';

/**
 * Conteneur de base pour toutes les pièces avec fond d'écran et notes
 * Fournit un layout flexible ou en grille selon les besoins
 * @renders BaseRoomContainer
 * @renders RoomNote
 */
const BaseRoom = ({ 
  roomType, 
  children, 
  layoutType = 'flex', // 'flex' ou 'grid'
  className 
}) => {
  return (
    <BaseRoomContainer layoutType={layoutType} className={className}>
      {children}
      <RoomNote roomType={roomType} />
    </BaseRoomContainer>
  );
};

BaseRoom.propTypes = {
  /** Type de la pièce pour afficher les notes appropriées */
  roomType: PropTypes.string.isRequired,
  /** Contenu à afficher dans la pièce */
  children: PropTypes.node,
  /** Type de layout : 'flex' pour flexbox ou 'grid' pour CSS Grid */
  layoutType: PropTypes.oneOf(['flex', 'grid']),
  /** Classes CSS additionnelles */
  className: PropTypes.string
};

BaseRoom.defaultProps = {
  layoutType: 'flex',
  className: '',
  children: null
};

export default BaseRoom;
