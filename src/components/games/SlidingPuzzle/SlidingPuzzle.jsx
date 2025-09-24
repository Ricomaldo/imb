// src/components/games/SlidingPuzzle/SlidingPuzzle.jsx

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { alpha } from '../../../styles/color';

const PuzzleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  width: 100%;
  height: 100%;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing['2xs']};
  width: min(100%, 280px);
  aspect-ratio: 1;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => alpha(theme.colors.black, 0.3)};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: ${({ theme }) => `${theme.borders.base} solid ${theme.colors.border}`};
`;

const Tile = styled.button`
  background: ${({ $isEmpty, theme }) =>
    $isEmpty
      ? alpha(theme.colors.black, 0.5)
      : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
  };
  color: ${({ theme }) => theme.colors.text.light};
  border: ${({ $isEmpty, theme }) =>
    $isEmpty
      ? 'none'
      : `${theme.borders.thin} solid ${theme.colors.border}`
  };
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  font-family: ${({ theme }) => theme.typography.families.primary};
  cursor: ${({ $isEmpty }) => $isEmpty ? 'default' : 'pointer'};
  transition: ${({ theme }) => `all ${theme.motion.durations.fast} ${theme.motion.easings.standard}`};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $isEmpty }) => $isEmpty ? 0.2 : 1};
  box-shadow: ${({ $isEmpty, theme }) =>
    $isEmpty ? 'none' : theme.shadows.sm
  };

  &:hover:not(:disabled) {
    ${({ $isEmpty, theme }) => !$isEmpty && `
      transform: scale(1.05);
      box-shadow: ${theme.shadows.md};
    `}
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: ${({ theme }) => `${theme.borders.base} solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  cursor: pointer;
  transition: ${({ theme }) => `all ${theme.motion.durations.fast} ${theme.motion.easings.standard}`};

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

const InfoText = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  strong {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const WinMessage = styled.div`
  color: ${({ theme }) => theme.colors.accents.gold};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-align: center;
  animation: pulse 1s ease infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;

/**
 * Puzzle glissant 4x4 (15-puzzle)
 * @renders PuzzleContainer
 * @renders GameBoard
 * @renders Tile
 * @renders Controls
 */
const SlidingPuzzle = () => {
  // État initial : nombres de 1 à 15, plus une case vide (0)
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  // Initialiser le puzzle résolu
  const initializePuzzle = () => {
    const solved = [];
    for (let i = 1; i <= 15; i++) {
      solved.push(i);
    }
    solved.push(0); // Case vide à la fin
    return solved;
  };

  // Vérifier si le puzzle est résolu
  const checkWin = useCallback(() => {
    if (tiles.length === 0) return false;
    for (let i = 0; i < 15; i++) {
      if (tiles[i] !== i + 1) return false;
    }
    return tiles[15] === 0;
  }, [tiles]);

  // Trouver la position d'une tuile
  const findPosition = (value) => {
    const index = tiles.indexOf(value);
    return {
      row: Math.floor(index / 4),
      col: index % 4
    };
  };

  // Vérifier si deux positions sont adjacentes
  const areAdjacent = (pos1, pos2) => {
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  // Déplacer une tuile
  const moveTile = (tileValue) => {
    if (isWon || isShuffling) return;

    const tilePos = findPosition(tileValue);
    const emptyPos = findPosition(0);

    if (areAdjacent(tilePos, emptyPos)) {
      const newTiles = [...tiles];
      const tileIndex = tilePos.row * 4 + tilePos.col;
      const emptyIndex = emptyPos.row * 4 + emptyPos.col;

      // Échanger les positions
      [newTiles[tileIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[tileIndex]];

      setTiles(newTiles);
      setMoves(moves + 1);
    }
  };

  // Mélanger le puzzle (avec mouvements valides pour garantir la solvabilité)
  const shufflePuzzle = (initialTiles = null) => {
    setIsShuffling(true);
    let shuffled = initialTiles ? [...initialTiles] : [...tiles];

    // Si pas de tuiles, initialiser d'abord
    if (shuffled.length === 0) {
      shuffled = initializePuzzle();
    }

    const moves = 100; // Nombre de mouvements aléatoires

    for (let i = 0; i < moves; i++) {
      const emptyIndex = shuffled.indexOf(0);
      const emptyRow = Math.floor(emptyIndex / 4);
      const emptyCol = emptyIndex % 4;

      // Trouver les mouvements possibles
      const possibleMoves = [];
      if (emptyRow > 0) possibleMoves.push(emptyIndex - 4); // Haut
      if (emptyRow < 3) possibleMoves.push(emptyIndex + 4); // Bas
      if (emptyCol > 0) possibleMoves.push(emptyIndex - 1); // Gauche
      if (emptyCol < 3) possibleMoves.push(emptyIndex + 1); // Droite

      // Choisir un mouvement aléatoire
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // Échanger
      [shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]];
    }

    setTiles(shuffled);
    setMoves(0);
    setIsWon(false);
    setIsShuffling(false);
  };

  // Nouvelle partie
  const newGame = () => {
    const solved = initializePuzzle();
    setTiles(solved);
    setMoves(0);
    setIsWon(false);
    setTimeout(() => shufflePuzzle(solved), 100);
  };

  // Gestion du clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isWon || isShuffling) return;

      const emptyPos = findPosition(0);
      let tileToMove = null;

      switch(e.key) {
        case 'ArrowUp':
          // Déplacer la tuile du bas vers le haut (dans la case vide)
          if (emptyPos.row < 3) {
            tileToMove = tiles[(emptyPos.row + 1) * 4 + emptyPos.col];
          }
          break;
        case 'ArrowDown':
          // Déplacer la tuile du haut vers le bas
          if (emptyPos.row > 0) {
            tileToMove = tiles[(emptyPos.row - 1) * 4 + emptyPos.col];
          }
          break;
        case 'ArrowLeft':
          // Déplacer la tuile de droite vers la gauche
          if (emptyPos.col < 3) {
            tileToMove = tiles[emptyPos.row * 4 + (emptyPos.col + 1)];
          }
          break;
        case 'ArrowRight':
          // Déplacer la tuile de gauche vers la droite
          if (emptyPos.col > 0) {
            tileToMove = tiles[emptyPos.row * 4 + (emptyPos.col - 1)];
          }
          break;
        default:
          return;
      }

      if (tileToMove !== null) {
        e.preventDefault();
        moveTile(tileToMove);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [tiles, isWon, isShuffling]);

  // Vérifier la victoire
  useEffect(() => {
    if (tiles.length > 0 && checkWin()) {
      setIsWon(true);
    }
  }, [tiles, checkWin]);

  // Initialiser au montage
  useEffect(() => {
    newGame();
  }, []);

  return (
    <PuzzleContainer>
      <GameBoard>
        {tiles.map((value, index) => (
          <Tile
            key={index}
            $isEmpty={value === 0}
            onClick={() => value !== 0 && moveTile(value)}
            disabled={isWon || isShuffling}
          >
            {value !== 0 && value}
          </Tile>
        ))}
      </GameBoard>

      {isWon && (
        <WinMessage>
          🎉 Victoire en {moves} coups !
        </WinMessage>
      )}

      <Controls>
        <Button onClick={newGame}>
          Nouvelle Partie
        </Button>
        <Button onClick={shufflePuzzle} disabled={isShuffling}>
          Mélanger
        </Button>
      </Controls>

      <InfoText>
        <strong>Coups : {moves}</strong>
        <br />
        Utilisez la souris ou les flèches
      </InfoText>
    </PuzzleContainer>
  );
};

export default SlidingPuzzle;