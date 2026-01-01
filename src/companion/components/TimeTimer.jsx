// src/companion/components/TimeTimer.jsx

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  min-height: 200px;
`;

const TimerDisplay = styled.div`
  font-family: ${({ theme }) => theme.typography.families.secondary};
  font-size: 48px;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ $isRunning, theme }) => $isRunning ? theme.colors.accents.success : theme.colors.text.primary};
  text-align: center;
  letter-spacing: 0.05em;
`;

const ProgressRing = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    ${({ theme, $progress }) => `${theme.colors.accents.gold} ${$progress * 360}deg, rgba(255, 255, 255, 0.1) 0deg`}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: ${({ theme }) => theme.surfaces.primary};
  }
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: center;
`;

const DurationButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.surfaces.muted};
  color: ${({ theme }) => theme.colors.text.light};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.durations.fast};

  &:active {
    transform: scale(0.95);
  }
`;

const ActionButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'start': return theme.colors.accents.success;
      case 'pause': return theme.colors.accents.warm;
      case 'reset': return theme.colors.accents.danger;
      default: return theme.colors.primary;
    }
  }};
  color: ${({ theme }) => theme.colors.text.light};
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  cursor: pointer;
  min-width: 120px;
  transition: all ${({ theme }) => theme.motion.durations.fast};

  &:active {
    transform: scale(0.95);
  }
`;

const DURATIONS = [
  { label: '5m', minutes: 5 },
  { label: '10m', minutes: 10 },
  { label: '15m', minutes: 15 },
  { label: '25m', minutes: 25 },
  { label: '45m', minutes: 45 }
];

/**
 * TimeTimer - Timer visuel pour focus TDA/H
 * @renders TimerContainer
 * @renders ProgressRing
 * @renders TimerDisplay
 * @renders Controls
 */
const TimeTimer = () => {
  const [selectedDuration, setSelectedDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Vibration sur mobile si terminé
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (minutes) => {
    setSelectedDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
  };

  const progress = 1 - (timeLeft / (selectedDuration * 60));

  return (
    <TimerContainer>
      <ProgressRing $progress={progress}>
        <TimerDisplay $isRunning={isRunning}>
          {formatTime(timeLeft)}
        </TimerDisplay>
      </ProgressRing>

      <Controls>
        {DURATIONS.map(({ label, minutes }) => (
          <DurationButton
            key={minutes}
            $active={selectedDuration === minutes}
            onClick={() => handleDurationChange(minutes)}
            disabled={isRunning}
          >
            {label}
          </DurationButton>
        ))}
      </Controls>

      <Controls>
        {!isRunning ? (
          <ActionButton $variant="start" onClick={handleStart}>
            ▶ Démarrer
          </ActionButton>
        ) : (
          <ActionButton $variant="pause" onClick={handlePause}>
            ⏸ Pause
          </ActionButton>
        )}
        <ActionButton $variant="reset" onClick={handleReset}>
          ⟲ Reset
        </ActionButton>
      </Controls>
    </TimerContainer>
  );
};

export default TimeTimer;
