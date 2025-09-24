// src/components/layout/PanelGrid/PanelGrid.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { GridContainer } from './PanelGrid.styles';

/**
 * Grille flexible pour organiser les panels dans les rooms
 * Utilise CSS Grid pour un layout responsive et adaptable
 * @renders GridContainer
 */
const PanelGrid = ({
  columns = 5,
  rows = 5,
  gap = "8px",
  children,
  style,
  ...props
}) => {
  return (
    <GridContainer
      $columns={columns}
      $rows={rows}
      $gap={gap}
      style={style}
      {...props}
    >
      {children}
    </GridContainer>
  );
};

PanelGrid.propTypes = {
  /** Nombre de colonnes dans la grille */
  columns: PropTypes.number,
  /** Nombre de lignes dans la grille */
  rows: PropTypes.number,
  /** Espacement entre les éléments de la grille */
  gap: PropTypes.string,
  /** Éléments enfants à afficher dans la grille */
  children: PropTypes.node,
  /** Styles CSS additionnels */
  style: PropTypes.object
};

PanelGrid.defaultProps = {
  columns: 5,
  rows: 5,
  gap: '8px',
  children: null,
  style: {}
};

export default PanelGrid;