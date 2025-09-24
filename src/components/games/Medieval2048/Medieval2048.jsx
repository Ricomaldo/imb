// src/components/games/Medieval2048/Medieval2048.jsx

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { alpha } from '../../../styles/color';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  height: 100%;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing['3xs']};
  width: min(100%, 240px);
  aspect-ratio: 1;
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => alpha(theme.colors.black, 0.4)};
  border-radius: ${({ theme }) => theme.radii.md};
  border: ${({ theme }) => `${theme.borders.base} solid ${theme.colors.border}`};
`;

const Tile = styled.div`
  background: ${({ $value, theme }) => {
    const colors = {
      0: alpha(theme.colors.black, 0.2),
      2: '#6B4423',     // Paysan
      4: '#8B5A2B',     // Archer
      8: '#A0522D',     // Soldat
      16: '#CD853F',    // Chevalier
      32: '#DAA520',    // Capitaine
      64: '#FFD700',    // Baron
      128: '#FF8C00',   // Comte
      256: '#FF6347',   // Duc
      512: '#DC143C',   // Prince
      1024: '#8B0000',  // Roi
      2048: '#4B0082'   // Empereur
    };
    return colors[$value] || '#4B0082';
  }};
  color: ${({ theme }) => theme.colors.text.light};
  border-radius: ${({ theme }) => theme.radii.xs};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  font-size: ${({ $value }) => {
    if ($value === 0) return '0';
    if ($value < 100) return '16px';
    if ($value < 1000) return '14px';
    return '12px';
  }};
  transition: all 0.15s ease;
  box-shadow: ${({ $value, theme }) =>
    $value > 0 ? theme.shadows.sm : 'none'
  };
`;

const TileLabel = styled.div`
  font-size: 10px;
  opacity: 0.8;
  margin-top: 2px;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
  width: 100%;
`;

const Score = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  strong {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: ${({ theme }) => `${theme.borders.thin} solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: ${({ theme }) => `${theme.spacing['2xs']} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  cursor: pointer;
  transition: ${({ theme }) => `all ${theme.motion.durations.fast} ${theme.motion.easings.standard}`};

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    transform: scale(1.05);
  }
`;

const GameOver = styled.div`
  color: ${({ theme }) => theme.colors.accents.danger};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-align: center;
`;

const Win = styled.div`
  color: ${({ theme }) => theme.colors.accents.gold};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-align: center;
  animation: glow 1s ease infinite;

  @keyframes glow {
    0%, 100% { text-shadow: 0 0 5px currentColor; }
    50% { text-shadow: 0 0 15px currentColor; }
  }
`;

/**
 * 2048 version médiévale avec titres de noblesse
 */
const Medieval2048 = () => {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  // Titres de noblesse
  const titles = {
    0: '',
    2: 'Paysan',
    4: 'Archer',
    8: 'Soldat',
    16: 'Chevalier',
    32: 'Capitaine',
    64: 'Baron',
    128: 'Comte',
    256: 'Duc',
    512: 'Prince',
    1024: 'Roi',
    2048: 'Empereur'
  };

  // Initialiser le plateau
  const initBoard = () => {
    const newBoard = Array(16).fill(0);
    // Ajouter 2 tuiles initiales
    addNewTile(addNewTile(newBoard));
    return newBoard;
  };

  // Ajouter une nouvelle tuile (2 ou 4)
  const addNewTile = (currentBoard) => {
    const emptyIndices = [];
    currentBoard.forEach((val, idx) => {
      if (val === 0) emptyIndices.push(idx);
    });

    if (emptyIndices.length === 0) return currentBoard;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...currentBoard];
    newBoard[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  };

  // Déplacer les tuiles dans une direction
  const move = (direction) => {
    if (gameOver) return;

    let newBoard = [...board];
    let moved = false;
    let points = 0;

    const getRow = (i) => [
      newBoard[i * 4], newBoard[i * 4 + 1],
      newBoard[i * 4 + 2], newBoard[i * 4 + 3]
    ];

    const setRow = (i, row) => {
      newBoard[i * 4] = row[0];
      newBoard[i * 4 + 1] = row[1];
      newBoard[i * 4 + 2] = row[2];
      newBoard[i * 4 + 3] = row[3];
    };

    const getCol = (i) => [
      newBoard[i], newBoard[i + 4],
      newBoard[i + 8], newBoard[i + 12]
    ];

    const setCol = (i, col) => {
      newBoard[i] = col[0];
      newBoard[i + 4] = col[1];
      newBoard[i + 8] = col[2];
      newBoard[i + 12] = col[3];
    };

    const slideArray = (arr) => {
      const filtered = arr.filter(val => val !== 0);
      const missing = 4 - filtered.length;
      const zeros = Array(missing).fill(0);
      return [...filtered, ...zeros];
    };

    const combineArray = (arr) => {
      for (let i = 0; i < 3; i++) {
        if (arr[i] !== 0 && arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          arr[i + 1] = 0;
          points += arr[i];
          if (arr[i] === 2048) setHasWon(true);
        }
      }
      return arr;
    };

    const moveLeft = () => {
      for (let i = 0; i < 4; i++) {
        let row = getRow(i);
        const original = [...row];
        row = slideArray(row);
        row = combineArray(row);
        row = slideArray(row);
        setRow(i, row);
        if (JSON.stringify(original) !== JSON.stringify(row)) moved = true;
      }
    };

    const moveRight = () => {
      for (let i = 0; i < 4; i++) {
        let row = getRow(i);
        const original = [...row];
        row.reverse();
        row = slideArray(row);
        row = combineArray(row);
        row = slideArray(row);
        row.reverse();
        setRow(i, row);
        if (JSON.stringify(original) !== JSON.stringify(row)) moved = true;
      }
    };

    const moveUp = () => {
      for (let i = 0; i < 4; i++) {
        let col = getCol(i);
        const original = [...col];
        col = slideArray(col);
        col = combineArray(col);
        col = slideArray(col);
        setCol(i, col);
        if (JSON.stringify(original) !== JSON.stringify(col)) moved = true;
      }
    };

    const moveDown = () => {
      for (let i = 0; i < 4; i++) {
        let col = getCol(i);
        const original = [...col];
        col.reverse();
        col = slideArray(col);
        col = combineArray(col);
        col = slideArray(col);
        col.reverse();
        setCol(i, col);
        if (JSON.stringify(original) !== JSON.stringify(col)) moved = true;
      }
    };

    switch(direction) {
      case 'left': moveLeft(); break;
      case 'right': moveRight(); break;
      case 'up': moveUp(); break;
      case 'down': moveDown(); break;
      default: return;
    }

    if (moved) {
      newBoard = addNewTile(newBoard);
      setBoard(newBoard);
      setScore(score + points);
      if (score + points > best) setBest(score + points);
      checkGameOver(newBoard);
    }
  };

  // Vérifier si le jeu est terminé
  const checkGameOver = (currentBoard) => {
    // Vérifier s'il y a des cases vides
    if (currentBoard.includes(0)) return;

    // Vérifier s'il y a des mouvements possibles
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const idx = i * 4 + j;
        const val = currentBoard[idx];

        // Vérifier à droite
        if (j < 3 && val === currentBoard[idx + 1]) return;
        // Vérifier en bas
        if (i < 3 && val === currentBoard[idx + 4]) return;
      }
    }

    setGameOver(true);
  };

  // Nouvelle partie
  const newGame = () => {
    const newBoard = initBoard();
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setHasWon(false);
  };

  // Gestion du clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          move('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          move('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [board, gameOver, score]);

  // Initialiser au montage
  useEffect(() => {
    newGame();
  }, []);

  return (
    <GameContainer>
      <Score>
        <div><strong>Score:</strong> {score}</div>
        <div><strong>Record:</strong> {best}</div>
      </Score>

      <GameBoard>
        {board.map((value, index) => (
          <Tile key={index} $value={value}>
            {value > 0 && (
              <>
                <div>{value}</div>
                <TileLabel>{titles[value]}</TileLabel>
              </>
            )}
          </Tile>
        ))}
      </GameBoard>

      {gameOver && <GameOver>Partie terminée!</GameOver>}
      {hasWon && <Win>🏆 Empereur atteint!</Win>}

      <Controls>
        <Button onClick={newGame}>Nouvelle Partie</Button>
        <div style={{ fontSize: '11px', color: '#999' }}>
          Utilisez les flèches ←↑→↓
        </div>
      </Controls>
    </GameContainer>
  );
};

export default Medieval2048;