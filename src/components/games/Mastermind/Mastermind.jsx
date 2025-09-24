// src/components/games/Mastermind/Mastermind.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { alpha } from '../../../styles/color';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const GuessBoard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xs']};
  width: 100%;
  max-width: 200px;
`;

const GuessRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['3xs']};
  align-items: center;
  padding: ${({ theme }) => theme.spacing['3xs']};
  background: ${({ $isActive, theme }) =>
    $isActive
      ? alpha(theme.colors.accent, 0.1)
      : alpha(theme.colors.black, 0.2)
  };
  border-radius: ${({ theme }) => theme.radii.xs};
  border: ${({ $isActive, theme }) =>
    $isActive
      ? `1px solid ${theme.colors.accent}`
      : `1px solid transparent`
  };
`;

const Peg = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $color }) => $color || '#333'};
  border: ${({ theme }) => `1px solid ${theme.colors.border}`};
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  transition: ${({ theme }) => `all ${theme.motion.durations.fast} ${theme.motion.easings.standard}`};

  &:hover {
    ${({ $clickable, theme }) => $clickable && `
      transform: scale(1.1);
      box-shadow: ${theme.shadows.sm};
    `}
  }
`;

const Feedback = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const FeedbackPeg = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $type }) => {
    if ($type === 'exact') return '#4CAF50'; // Vert = bonne couleur, bonne position
    if ($type === 'color') return '#FFC107'; // Jaune = bonne couleur, mauvaise position
    return '#333'; // Vide
  }};
  border: 1px solid #222;
`;

const ColorPalette = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => alpha(theme.colors.black, 0.3)};
  border-radius: ${({ theme }) => theme.radii.sm};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: ${({ theme }) => `${theme.borders.thin} solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radii.xs};
  padding: ${({ theme }) => `${theme.spacing['3xs']} ${theme.spacing.xs}`};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  cursor: pointer;
  transition: ${({ theme }) => `all ${theme.motion.durations.fast} ${theme.motion.easings.standard}`};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accent};
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ $type, theme }) =>
    $type === 'win' ? theme.colors.accents.success :
    $type === 'lose' ? theme.colors.accents.danger :
    theme.colors.text.secondary
  };
`;

const SecretRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['3xs']};
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ $revealed, theme }) =>
    $revealed
      ? alpha(theme.colors.accents.gold, 0.2)
      : 'repeating-linear-gradient(45deg, #333, #333 5px, #444 5px, #444 10px)'
  };
  border-radius: ${({ theme }) => theme.radii.xs};
  border: ${({ theme }) => `2px solid ${theme.colors.accents.gold}`};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

/**
 * Jeu Mastermind - Deviner la combinaison de couleurs
 */
const Mastermind = () => {
  const colors = ['#FF5252', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF9800'];
  const maxGuesses = 8;

  const [secret, setSecret] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([null, null, null, null]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  // Générer une combinaison secrète
  const generateSecret = () => {
    const newSecret = [];
    for (let i = 0; i < 4; i++) {
      newSecret.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    return newSecret;
  };

  // Calculer le feedback (pegs noirs et blancs)
  const calculateFeedback = (guess) => {
    const secretCopy = [...secret];
    const guessCopy = [...guess];
    const feedback = [];

    // D'abord vérifier les positions exactes (pegs verts)
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        feedback.push('exact');
        secretCopy[i] = null;
        guessCopy[i] = null;
      }
    }

    // Ensuite vérifier les couleurs correctes mal placées (pegs jaunes)
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] !== null) {
        const secretIndex = secretCopy.indexOf(guessCopy[i]);
        if (secretIndex !== -1) {
          feedback.push('color');
          secretCopy[secretIndex] = null;
        }
      }
    }

    // Compléter avec des vides
    while (feedback.length < 4) {
      feedback.push('empty');
    }

    return feedback;
  };

  // Placer une couleur dans la position actuelle
  const placePeg = (position) => {
    if (gameStatus !== 'playing' || currentRow >= maxGuesses) return;

    const newGuess = [...currentGuess];
    newGuess[position] = selectedColor;
    setCurrentGuess(newGuess);
  };

  // Soumettre la tentative
  const submitGuess = () => {
    if (currentGuess.includes(null)) return; // Pas complet

    const feedback = calculateFeedback(currentGuess);
    const newGuesses = [...guesses, { guess: currentGuess, feedback }];
    setGuesses(newGuesses);

    // Vérifier la victoire
    if (feedback.every(f => f === 'exact')) {
      setGameStatus('won');
      return;
    }

    // Vérifier la défaite
    if (currentRow >= maxGuesses - 1) {
      setGameStatus('lost');
      return;
    }

    // Passer à la ligne suivante
    setCurrentRow(currentRow + 1);
    setCurrentGuess([null, null, null, null]);
  };

  // Nouvelle partie
  const newGame = () => {
    setSecret(generateSecret());
    setGuesses([]);
    setCurrentGuess([null, null, null, null]);
    setCurrentRow(0);
    setGameStatus('playing');
  };

  // Initialiser au montage
  useEffect(() => {
    newGame();
  }, []);

  return (
    <GameContainer>
      <SecretRow $revealed={gameStatus !== 'playing'}>
        {secret.map((color, i) => (
          <Peg
            key={i}
            $color={gameStatus !== 'playing' ? color : '#555'}
            $clickable={false}
          />
        ))}
      </SecretRow>

      {gameStatus === 'won' && <Message $type="win">🎉 Bravo!</Message>}
      {gameStatus === 'lost' && <Message $type="lose">Perdu! Réessayez</Message>}

      <GuessBoard>
        {/* Afficher les tentatives précédentes */}
        {guesses.map((g, rowIndex) => (
          <GuessRow key={rowIndex} $isActive={false}>
            {g.guess.map((color, i) => (
              <Peg key={i} $color={color} $clickable={false} />
            ))}
            <Feedback>
              {g.feedback.map((type, i) => (
                <FeedbackPeg key={i} $type={type} />
              ))}
            </Feedback>
          </GuessRow>
        ))}

        {/* Ligne active */}
        {gameStatus === 'playing' && currentRow < maxGuesses && (
          <GuessRow $isActive={true}>
            {currentGuess.map((color, i) => (
              <Peg
                key={i}
                $color={color || '#333'}
                $clickable={true}
                onClick={() => placePeg(i)}
              />
            ))}
            <Feedback>
              {[0, 1, 2, 3].map(i => (
                <FeedbackPeg key={i} $type="empty" />
              ))}
            </Feedback>
          </GuessRow>
        )}

        {/* Lignes vides restantes */}
        {gameStatus === 'playing' && Array(maxGuesses - currentRow - 1).fill(null).map((_, i) => (
          <GuessRow key={`empty-${i}`} $isActive={false}>
            {[0, 1, 2, 3].map(j => (
              <Peg key={j} $color="#333" $clickable={false} />
            ))}
            <Feedback>
              {[0, 1, 2, 3].map(j => (
                <FeedbackPeg key={j} $type="empty" />
              ))}
            </Feedback>
          </GuessRow>
        ))}
      </GuessBoard>

      <ColorPalette>
        {colors.map(color => (
          <Peg
            key={color}
            $color={color}
            $clickable={true}
            onClick={() => setSelectedColor(color)}
            style={{
              border: selectedColor === color ? '2px solid #FFF' : '1px solid #666',
              transform: selectedColor === color ? 'scale(1.2)' : 'scale(1)'
            }}
          />
        ))}
      </ColorPalette>

      <Controls>
        <Button
          onClick={submitGuess}
          disabled={gameStatus !== 'playing' || currentGuess.includes(null)}
        >
          Valider
        </Button>
        <Button onClick={newGame}>
          Nouvelle
        </Button>
      </Controls>

      <Message>
        Essai {currentRow + 1}/{maxGuesses}
      </Message>
    </GameContainer>
  );
};

export default Mastermind;