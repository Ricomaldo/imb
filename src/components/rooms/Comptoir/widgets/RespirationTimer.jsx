import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid ${props => props.color};
  border-radius: 12px;
  text-align: center;
`;

const Circle = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2em;
  font-weight: bold;
  color: #fff;
  transition: all 0.1s ease-out;
  border: 4px solid ${props => props.color};
  background: ${props => {
    switch (props.phase) {
      case 'inhale': return 'rgba(76, 175, 80, 0.2)';  // Green
      case 'hold': return 'rgba(255, 193, 7, 0.2)';     // Yellow
      case 'exhale': return 'rgba(244, 67, 54, 0.2)';   // Red
      default: return 'rgba(0, 0, 0, 0.2)';
    }
  }};
  transform: ${props => {
    switch (props.phase) {
      case 'inhale': return 'scale(1.1)';
      case 'hold': return 'scale(1)';
      case 'exhale': return 'scale(0.9)';
      default: return 'scale(1)';
    }
  }};
`;

const PhaseText = styled.div`
  font-size: 1em;
  opacity: 0.8;
  margin-bottom: 10px;
`;

const Count = styled.div`
  font-size: 4em;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
`;

const Info = styled.div`
  margin-top: 15px;
  font-size: 0.85em;
  opacity: 0.8;
  line-height: 1.5;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-top: 15px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.color};
  width: ${props => props.percent}%;
  transition: width 0.1s linear;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;
`;

const Button = styled.button`
  background: ${props => props.color};
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85em;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const RespirationTimer = ({ pattern, color, onComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('inhale'); // inhale | hold | exhale
  const [count, setCount] = useState(pattern.inhale);
  const [cycleNumber, setCycleNumber] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  const totalSeconds = pattern.inhale + pattern.hold + pattern.exhale;
  const elapsedSeconds = totalSeconds - count;
  const progressPercent = (elapsedSeconds / totalSeconds) * 100;

  const phaseLabels = {
    inhale: '↑ Inspire',
    hold: '○ Retiens',
    exhale: '↓ Expire'
  };

  const phaseDescriptions = {
    inhale: `Inspire par le nez (${pattern.inhale} sec)`,
    hold: `Retiens ton souffle (${pattern.hold} sec)`,
    exhale: `Expire lentement par la bouche (${pattern.exhale} sec)`
  };

  // Timer loop
  useEffect(() => {
    if (!isRunning || isFinished) return;

    const interval = setInterval(() => {
      setCount(currentCount => {
        if (currentCount > 1) {
          return currentCount - 1;
        }

        // Transition to next phase
        setPhase(currentPhase => {
          switch (currentPhase) {
            case 'inhale':
              setCount(pattern.hold);
              return 'hold';
            case 'hold':
              setCount(pattern.exhale);
              return 'exhale';
            case 'exhale':
              // Check if finished
              if (cycleNumber >= pattern.cycles) {
                setIsRunning(false);
                setIsFinished(true);
                return 'inhale';
              }
              // Start new cycle
              setCycleNumber(prev => prev + 1);
              setCount(pattern.inhale);
              return 'inhale';
            default:
              return currentPhase;
          }
        });

        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isFinished, cycleNumber, pattern]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('inhale');
    setCount(pattern.inhale);
    setCycleNumber(1);
    setIsFinished(false);
  };

  return (
    <TimerContainer color={color}>
      <h3>🫁 Respiration Contrôlée</h3>

      <PhaseText>{phaseLabels[phase]}</PhaseText>

      <Circle phase={phase} color={color}>
        <Count>{count}</Count>
      </Circle>

      <Info>
        <div>{phaseDescriptions[phase]}</div>
        <div style={{ marginTop: '8px', fontSize: '0.9em' }}>
          Cycle {cycleNumber} / {pattern.cycles}
        </div>
      </Info>

      <ProgressBar>
        <ProgressFill percent={progressPercent} color={color} />
      </ProgressBar>

      <Controls>
        {!isRunning && !isFinished && (
          <Button color={color} onClick={handleStart}>
            ▶️ Commencer
          </Button>
        )}
        {isRunning && (
          <Button color={color} onClick={handlePause}>
            ⏸️ Pause
          </Button>
        )}
        {(isRunning || !isFinished) && (
          <Button color={color} onClick={handleReset}>
            ↺ Réinitialiser
          </Button>
        )}
      </Controls>

      {isFinished && (
        <Info style={{ marginTop: '15px', color: '#4CAF50', fontWeight: 'bold' }}>
          ✅ Protocole terminé! {pattern.cycles} cycles complétés.
          {onComplete && (
            <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
              <Button color={color} onClick={onComplete}>
                Poursuivre...
              </Button>
            </div>
          )}
        </Info>
      )}
    </TimerContainer>
  );
};
