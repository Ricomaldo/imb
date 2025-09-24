// src/components/modals/SettingsModal/RoomLayoutEditor.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { roomConfig } from '../../../utils/roomPositions';
import { roomColors } from '../../../utils/assetMapping';
import Button from '../../common/Button/Button';
import { alpha } from '../../../styles/color';

const EditorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: ${({ theme }) => theme.spacing['2xs']};
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  aspect-ratio: 6 / 5;
  background: ${props => props.theme.colors.background};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${props => props.theme.radii.lg};
  border: ${({ theme }) => `${theme.borders.thin} solid ${theme.colors.border}`};
  position: relative;
`;

const RoomTile = styled.div`
  background: ${props => {
    if (props.$isEmpty) {
      return `linear-gradient(45deg,
        ${alpha(props.theme.colors.secondary, 0.1)} 25%,
        ${alpha(props.theme.colors.secondary, 0.2)} 25%,
        ${alpha(props.theme.colors.secondary, 0.2)} 75%,
        ${alpha(props.theme.colors.secondary, 0.1)} 75%)`;
    }
    return props.$color || props.theme.colors.secondary;
  }};
  border: ${props => props.theme.borders.base} solid ${props =>
    props.$isDragging
      ? props.theme.colors.accents.gold
      : props.$isEmpty
        ? alpha(props.theme.colors.border, 0.3)
        : props.theme.colors.border
  };
  border-radius: ${({ theme }) => theme.radii.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${props => props.$isEmpty
    ? alpha(props.theme.colors.text.secondary, 0.5)
    : props.theme.colors.text.primary
  };
  cursor: ${props => props.$isEmpty ? 'default' : 'move'};
  transition: ${({ theme }) => `all ${theme.motion.durations.base} ${theme.motion.easings.standard}`};
  position: relative;
  opacity: ${props => props.$isDragging ? 0.5 : 1};
  text-shadow: ${props => props.$isEmpty ? 'none' : `0 1px 2px ${alpha(props.theme.colors.black, 0.8)}`};

  &:hover {
    ${props => !props.$isEmpty && !props.$isDragging && `
      transform: scale(1.02);
      box-shadow: ${props.theme.shadows.md};
      z-index: 10;
    `}
  }

  ${props => props.$isDragOver && `
    background: ${alpha(props.theme.colors.accents.gold, 0.2)};
    border-color: ${props.theme.colors.accents.gold};
  `}
`;

const RoomLabel = styled.span`
  text-shadow: 0 1px 2px ${({ theme }) => alpha(theme.colors.black, 0.5)};
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xs']};
  user-select: none;
`;

const EmptyLabel = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-style: italic;
  opacity: 0.5;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  user-select: none;
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const InfoText = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${props => props.theme.typography.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Room layout editor with 5x6 grid and drag & drop
 * @renders EditorContainer
 * @renders GridContainer
 * @renders RoomTile
 * @renders Controls
 */
const RoomLayoutEditor = ({ onSave, initialLayout = null }) => {
  const [layout, setLayout] = useState([]);
  const [draggedRoom, setDraggedRoom] = useState(null);
  const [dragOverPos, setDragOverPos] = useState(null);

  // Initialiser la grille 6x5
  useEffect(() => {
    if (initialLayout && initialLayout.length > 0) {
      setLayout(initialLayout);
    } else {
      // Créer une grille 6x5 avec les 12 pièces au centre et des cases vides autour
      const grid = [];

      // D'abord, créer toutes les cases vides (6 colonnes x 5 rangées)
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 6; x++) {
          grid.push({ x, y, type: 'empty', name: 'Vide' });
        }
      }

      // Puis placer les 12 pièces existantes au centre
      // La grille originale est 4x3, on la centre dans 6x5 avec 1 case de bordure
      roomConfig.forEach((room, index) => {
        // Les pièces vont de (0,0)-(3,2) dans la config originale
        // On les place de (1,1)-(4,3) dans la grille 6x5
        const newX = room.x + 1; // Décaler de 1 pour la bordure gauche
        const newY = room.y + 1; // Décaler de 1 pour la bordure haute
        const gridIndex = newY * 6 + newX; // Multiplier par 6 (nombre de colonnes)

        grid[gridIndex] = {
          x: newX,
          y: newY,
          type: room.type,
          name: room.name
        };
      });

      setLayout(grid);
    }
  }, [initialLayout]);

  // Gérer le début du drag
  const handleDragStart = (e, room) => {
    if (room.type === 'empty') return;
    setDraggedRoom(room);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Gérer le survol pendant le drag
  const handleDragOver = (e, position) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverPos(`${position.x},${position.y}`);
  };

  // Gérer la sortie du survol
  const handleDragLeave = () => {
    setDragOverPos(null);
  };

  // Gérer le drop
  const handleDrop = (e, targetPosition) => {
    e.preventDefault();
    setDragOverPos(null);

    if (!draggedRoom) return;

    // Échanger les positions
    const newLayout = layout.map(tile => {
      // La pièce qui était à la position cible
      if (tile.x === targetPosition.x && tile.y === targetPosition.y) {
        return {
          ...tile,
          type: draggedRoom.type,
          name: draggedRoom.name
        };
      }
      // La position d'origine de la pièce déplacée devient vide ou prend la pièce échangée
      if (tile.x === draggedRoom.x && tile.y === draggedRoom.y) {
        const targetTile = layout.find(t => t.x === targetPosition.x && t.y === targetPosition.y);
        return {
          ...tile,
          type: targetTile.type,
          name: targetTile.name
        };
      }
      return tile;
    });

    setLayout(newLayout);
    setDraggedRoom(null);
  };

  // Réinitialiser à la configuration par défaut
  const handleReset = () => {
    // Recréer la grille par défaut 6x5
    const grid = [];

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 6; x++) {
        grid.push({ x, y, type: 'empty', name: 'Vide' });
      }
    }

    roomConfig.forEach((room) => {
      // Centrer la grille 4x3 dans la grille 6x5
      const newX = room.x + 1;
      const newY = room.y + 1;
      const gridIndex = newY * 6 + newX; // Multiplier par 6 (nombre de colonnes)

      grid[gridIndex] = {
        x: newX,
        y: newY,
        type: room.type,
        name: room.name
      };
    });

    setLayout(grid);
  };

  // Sauvegarder la configuration
  const handleSave = () => {
    if (onSave) {
      // Sauvegarder toute la grille 6x5
      onSave(layout);
    }
  };

  return (
    <EditorContainer>
      <GridContainer>
        {layout.map((tile, index) => {
          const isDragging = draggedRoom &&
            tile.x === draggedRoom.x &&
            tile.y === draggedRoom.y;
          const isDragOver = dragOverPos === `${tile.x},${tile.y}`;

          return (
            <RoomTile
              key={`${tile.x}-${tile.y}`}
              $color={tile.type !== 'empty' ? roomColors[tile.type] : null}
              $isEmpty={tile.type === 'empty'}
              $isDragging={isDragging}
              $isDragOver={isDragOver}
              draggable={tile.type !== 'empty'}
              onDragStart={(e) => handleDragStart(e, tile)}
              onDragOver={(e) => handleDragOver(e, tile)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, tile)}
              title={tile.name}
            >
              {tile.type === 'empty' ? (
                <EmptyLabel>✦</EmptyLabel>
              ) : (
                <RoomLabel>{tile.name}</RoomLabel>
              )}
            </RoomTile>
          );
        })}
      </GridContainer>

      <InfoText>
        Glissez-déposez les pièces pour réorganiser votre demeure
      </InfoText>

      <Controls>
        <Button onClick={handleReset} size="small" variant="secondary">
          ↺ Réinitialiser
        </Button>
        <Button onClick={handleSave} size="small" disabled={layout.length === 0}>
          💾 Sauvegarder
        </Button>
      </Controls>
    </EditorContainer>
  );
};

export default RoomLayoutEditor;