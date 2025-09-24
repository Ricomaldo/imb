// src/components/modals/SettingsModal/RoomLayoutEditor.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { roomConfig } from '../../../utils/roomPositions';
import { roomColors } from '../../../utils/assetMapping';
import Button from '../../common/Button/Button';

const EditorContainer = styled.div`
  padding: 20px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  aspect-ratio: 4 / 3;
  background: ${props => props.theme.colors.background.secondary};
  padding: 8px;
  border-radius: 8px;
  position: relative;
`;

const RoomTile = styled.div`
  background: ${props => props.$isEmpty ? 'rgba(255,255,255,0.1)' : props.$color};
  border: 2px solid ${props => props.$isEmpty
    ? 'rgba(255,255,255,0.3)'
    : props.$isMovable
      ? props.theme.colors.accents.warm
      : props.theme.colors.border};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.$isEmpty ? 'rgba(255,255,255,0.5)' : props.theme.colors.text.primary};
  cursor: ${props => props.$isMovable ? 'pointer' : 'default'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  opacity: ${props => props.$isEmpty ? 0.5 : 1};
  text-shadow: ${props => props.$isEmpty ? 'none' : '0 1px 2px rgba(0,0,0,0.8)'};

  &:hover {
    ${props => props.$isMovable && !props.$isEmpty && `
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      border-color: ${props.theme.colors.accents.hot};
      z-index: 10;
    `}
  }

  ${props => props.$isMoving && `
    animation: slideMove 0.3s ease-out;
  `}
`;

const RoomLabel = styled.span`
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  text-align: center;
  padding: 2px;
`;

const EmptyLabel = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-style: italic;
  opacity: 0.5;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
`;

const InfoText = styled.div`
  text-align: center;
  margin-top: 15px;
  font-size: 12px;
  color: ${props => props.theme.colors.text.secondary};
`;

const MoveCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Room layout editor with puzzle slider mechanics
 * @renders EditorContainer
 * @renders GridContainer
 * @renders RoomTile
 * @renders Controls
 */
const RoomLayoutEditor = ({ onSave, initialLayout = null }) => {
  // État initial avec une case vide en position (3,2)
  const [layout, setLayout] = useState([]);
  const [emptyPos, setEmptyPos] = useState({ x: 3, y: 2 });
  const [moveCount, setMoveCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialiser la grille
  useEffect(() => {
    if (initialLayout) {
      setLayout(initialLayout);
      // Trouver la position vide
      const empty = initialLayout.find(tile => tile.type === 'empty');
      if (empty) {
        setEmptyPos({ x: empty.x, y: empty.y });
      }
    } else {
      // Configuration par défaut avec case vide en bas à droite
      const defaultLayout = [
        ...roomConfig.slice(0, 11), // Les 11 premières pièces
        { x: 3, y: 2, type: 'empty', name: 'Vide' } // Case vide
      ];
      setLayout(defaultLayout);
    }
  }, [initialLayout]);

  // Vérifier si une tuile est adjacente à la case vide
  const isAdjacentToEmpty = (x, y) => {
    const dx = Math.abs(x - emptyPos.x);
    const dy = Math.abs(y - emptyPos.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  };

  // Déplacer une tuile vers la case vide
  const moveTile = (tile) => {
    if (!isAdjacentToEmpty(tile.x, tile.y) || isAnimating) return;

    setIsAnimating(true);

    const newLayout = layout.map(t => {
      if (t.x === tile.x && t.y === tile.y) {
        // La tuile cliquée prend la position de la case vide
        return { ...t, x: emptyPos.x, y: emptyPos.y };
      } else if (t.type === 'empty') {
        // La case vide prend la position de la tuile
        return { ...t, x: tile.x, y: tile.y };
      }
      return t;
    });

    setLayout(newLayout);
    setEmptyPos({ x: tile.x, y: tile.y });
    setMoveCount(moveCount + 1);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Réinitialiser à la configuration par défaut
  const handleReset = () => {
    const defaultLayout = [
      ...roomConfig,
      { x: 3, y: 2, type: 'empty', name: 'Vide' }
    ].map((room, index) => {
      const x = index % 4;
      const y = Math.floor(index / 4);
      return { ...room, x, y };
    });

    setLayout(defaultLayout);
    setEmptyPos({ x: 3, y: 2 });
    setMoveCount(0);
  };

  // Mélanger aléatoirement (en faisant des mouvements valides)
  const handleShuffle = () => {
    let tempLayout = [...layout];
    let tempEmpty = { ...emptyPos };

    // Faire 50 mouvements aléatoires
    for (let i = 0; i < 50; i++) {
      // Trouver les mouvements possibles
      const possibleMoves = tempLayout.filter(tile => {
        if (tile.type === 'empty') return false;
        const dx = Math.abs(tile.x - tempEmpty.x);
        const dy = Math.abs(tile.y - tempEmpty.y);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
      });

      if (possibleMoves.length > 0) {
        // Choisir un mouvement aléatoire
        const randomTile = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

        // Échanger les positions
        tempLayout = tempLayout.map(t => {
          if (t.x === randomTile.x && t.y === randomTile.y) {
            return { ...t, x: tempEmpty.x, y: tempEmpty.y };
          } else if (t.type === 'empty') {
            return { ...t, x: randomTile.x, y: randomTile.y };
          }
          return t;
        });

        tempEmpty = { x: randomTile.x, y: randomTile.y };
      }
    }

    setLayout(tempLayout);
    setEmptyPos(tempEmpty);
    setMoveCount(0);
  };

  // Sauvegarder la configuration
  const handleSave = () => {
    if (onSave) {
      // Retirer la case vide avant de sauvegarder
      const savedLayout = layout
        .filter(tile => tile.type !== 'empty')
        .map(tile => ({
          type: tile.type,
          x: tile.x,
          y: tile.y
        }));
      onSave(savedLayout);
    }
  };

  // Créer la grille ordonnée pour l'affichage
  const orderedGrid = [];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 4; x++) {
      const tile = layout.find(t => t.x === x && t.y === y);
      orderedGrid.push(tile || { x, y, type: 'placeholder', name: '?' });
    }
  }

  return (
    <EditorContainer>
      <GridContainer>
        {orderedGrid.map((tile, index) => (
          <RoomTile
            key={`${tile.type}-${index}`}
            $color={tile.type !== 'empty' ? roomColors[tile.type] : 'transparent'}
            $isEmpty={tile.type === 'empty'}
            $isMovable={tile.type !== 'empty' && isAdjacentToEmpty(tile.x, tile.y)}
            onClick={() => moveTile(tile)}
            title={tile.type !== 'empty'
              ? isAdjacentToEmpty(tile.x, tile.y)
                ? `Cliquer pour déplacer ${tile.name}`
                : tile.name
              : 'Case vide'}
          >
            {tile.type === 'empty' ? (
              <EmptyLabel>Vide</EmptyLabel>
            ) : (
              <RoomLabel>{tile.name}</RoomLabel>
            )}
          </RoomTile>
        ))}
      </GridContainer>

      <InfoText>
        Cliquez sur une pièce adjacente à la case vide pour la déplacer
      </InfoText>

      <ControlsContainer>
        <MoveCounter>
          🎯 Mouvements : {moveCount}
        </MoveCounter>
        <Controls>
          <Button onClick={handleReset} size="small" variant="secondary">
            ↺ Réinitialiser
          </Button>
          <Button onClick={handleShuffle} size="small" variant="secondary">
            🎲 Mélanger
          </Button>
          <Button onClick={handleSave} size="small" disabled={layout.length === 0}>
            💾 Sauvegarder
          </Button>
        </Controls>
      </ControlsContainer>
    </EditorContainer>
  );
};

export default RoomLayoutEditor;