// src/components/room-modules/cuisine/HydrationReminder.jsx

import React, { useState } from 'react';
import {
  Container,
  MessageContainer,
  Message,
  Icon,
  Button,
  SparkleContainer,
  Sparkle
} from './HydrationReminder.styles';

/**
 * Widget de rappel d'hydratation
 * Affiche un message bienveillant et une animation de célébration
 * @renders Container
 * @renders Message
 * @renders Button
 * @renders Sparkles (animation)
 */
const HydrationReminder = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastDrinkTime, setLastDrinkTime] = useState(null);

  const handleDrink = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setLastDrinkTime(new Date());

    // Arrêter l'animation après 3 secondes
    setTimeout(() => {
      setIsAnimating(false);
    }, 3000);
  };

  // Générer des particules pour l'animation
  const sparkles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    left: 20 + Math.random() * 60, // Position horizontale (20% à 80%)
    duration: 0.8 + Math.random() * 0.7 // Durée (0.8s à 1.5s)
  }));

  return (
    <Container>
      <MessageContainer>
        <Icon>💧</Icon>
        <Message>
          Pause hydratation ?
          {lastDrinkTime && (
            <span>
              Dernière gorgée {new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </Message>
      </MessageContainer>

      <Button
        onClick={handleDrink}
        $isAnimating={isAnimating}
        disabled={isAnimating}
        aria-label="Confirmer hydratation"
      >
        <span>J'ai bu</span>
        {isAnimating && (
          <SparkleContainer>
            {sparkles.map(sparkle => (
              <Sparkle
                key={sparkle.id}
                $delay={sparkle.delay}
                $left={sparkle.left}
                $duration={sparkle.duration}
              >
                ✨
              </Sparkle>
            ))}
          </SparkleContainer>
        )}
      </Button>
    </Container>
  );
};

export default HydrationReminder;