// src/components/common/MarkdownToolbar/MarkdownToolbar.jsx

import React from 'react';
import styled from 'styled-components';
import { MEDIA_QUERIES } from '../../../utils/responsiveConfig';

const ToolbarContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const ToolbarButton = styled.button`
  background: ${({ $active }) => $active ? 'white' : '#F0F0F0'};
  border: 1px solid currentColor;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  min-width: 32px;
  height: 24px;
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
  margin-left: ${({ $marginLeft }) => $marginLeft ? '4px' : '0'};

  /* Responsive - iPad horizontal / TabletWide (1024-1439px) */
  @media ${MEDIA_QUERIES.tabletWideOnly} {
    min-width: 28px;
    height: 22px;
    font-size: 11px;
    padding: 3px 6px;
  }

  /* Responsive - Tablet (768-1023px) */
  @media ${MEDIA_QUERIES.tablet} {
    min-width: 26px;
    height: 20px;
    font-size: 10px;
    padding: 2px 5px;
  }
`;

/**
 * Toolbar for markdown editing with zoom and edit controls
 * @renders ToolbarContainer
 * @renders ToolbarButton
 */
const MarkdownToolbar = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  isEditing,
  onToggleEdit,
  isExpanded,
  onToggleExpand,
  onSave,
  isSaving = false,
  showEditButton = true,
  showExpandButton = true,
  showSaveButton = false
}) => {
  return (
    <ToolbarContainer>
      {/* Boutons zoom */}
      <ToolbarButton
        onClick={onZoomOut}
        disabled={zoomLevel <= -2}
        title="Réduire la taille du texte"
      >
        🔍︎-
      </ToolbarButton>
      <ToolbarButton
        onClick={onZoomIn}
        disabled={zoomLevel >= 5}
        title="Augmenter la taille du texte"
      >
        🔍︎+
      </ToolbarButton>

      {/* Bouton d'édition */}
      {showEditButton && (
        <ToolbarButton
          onClick={onToggleEdit}
          $active={isEditing}
          $marginLeft
          title={isEditing ? 'Mode lecture' : 'Mode édition'}
        >
          {isEditing ? '👁️' : '✏️'}
        </ToolbarButton>
      )}

      {/* Bouton save (visible en édition) */}
      {showSaveButton && isEditing && (
        <ToolbarButton
          onClick={onSave}
          disabled={isSaving}
          title={isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder'}
        >
          {isSaving ? '⏳' : '💾'}
        </ToolbarButton>
      )}

      {/* Bouton expand (mode focus) */}
      {showExpandButton && (
        <ToolbarButton
          onClick={onToggleExpand}
          $active={isExpanded}
          title={isExpanded ? 'Réduire' : 'Mode focus (plein écran)'}
        >
          {isExpanded ? '⛶' : '⛶'}
        </ToolbarButton>
      )}
    </ToolbarContainer>
  );
};

export default MarkdownToolbar;