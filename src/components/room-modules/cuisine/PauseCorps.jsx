// src/components/room-modules/cuisine/PauseCorps.jsx

import React, { useState, useEffect } from 'react';
import exercicesData from '../../../data/exercices.json';
import encouragementsData from '../../../data/encouragements.json';
import {
  PauseCorpsContainer,
  ExerciceCard,
  ExerciceTitle,
  ExerciceDescription,
  ExerciceDuration,
  ActionButton,
  EncouragementMessage,
  CorpsIcon,
  TargetBadge,
  MysteryCard,
  MysteryText,
  RevealButton,
  TargetsContainer,
  TitleRow
} from './PauseCorps.styles';

/**
 * PauseCorps - Widget bienveillant de micro-mouvements pour développeur
 * Combat raideurs nuque et fatigue oculaire pendant sessions dev
 * @renders Exercice aléatoire avec encouragement après accomplissement
 */
const PauseCorps = () => {
  const [currentExercice, setCurrentExercice] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  // Sélectionner un exercice aléatoire au montage et après chaque accomplissement
  const selectRandomExercice = () => {
    const exercices = exercicesData.exercices;
    const randomIndex = Math.floor(Math.random() * exercices.length);
    setCurrentExercice(exercices[randomIndex]);
  };

  useEffect(() => {
    selectRandomExercice();
  }, []);

  const handleReveal = () => {
    setIsRevealed(true);
    selectRandomExercice();
  };

  const handleExerciceDone = () => {
    // Sélectionner un encouragement aléatoire
    const encouragements = encouragementsData.encouragements;
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

    // Afficher l'encouragement avec animation
    setEncouragement(randomEncouragement);
    setIsAnimating(true);

    // Après l'animation, réinitialiser
    setTimeout(() => {
      setIsAnimating(false);
      setEncouragement('');
      setIsRevealed(false); // Cacher à nouveau pour le prochain exercice
    }, 2500);
  };

  return (
    <PauseCorpsContainer>
      {isAnimating && encouragement ? (
        <EncouragementMessage className="animate">
          ✨ {encouragement}
        </EncouragementMessage>
      ) : !isRevealed ? (
        <MysteryCard>
          <CorpsIcon>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 12 L20 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 16 L20 14 L28 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 24 L16 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 24 L24 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </CorpsIcon>
          <MysteryText>Un exercice t'attend...</MysteryText>
          <RevealButton onClick={handleReveal}>
            Révéler l'exercice
          </RevealButton>
        </MysteryCard>
      ) : currentExercice ? (
        <ExerciceCard className="revealed">
          <TitleRow>
            <ExerciceTitle>{currentExercice.nom}</ExerciceTitle>
            <ExerciceDuration>
              {currentExercice.duree_seconde}s
            </ExerciceDuration>
          </TitleRow>

          <ExerciceDescription>
            {currentExercice.description}
          </ExerciceDescription>

          <TargetsContainer>
            {currentExercice.cible.map(target => (
              <TargetBadge key={target}>
                {target}
              </TargetBadge>
            ))}
          </TargetsContainer>

          <ActionButton onClick={handleExerciceDone}>
            ✓ Fait
          </ActionButton>
        </ExerciceCard>
      ) : null}
    </PauseCorpsContainer>
  );
};

export default PauseCorps;