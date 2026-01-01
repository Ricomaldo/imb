import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
  margin: 20px 0;
  padding: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0.15) 100%);
  border: 1px solid ${props => props.color}66;
  border-radius: 12px;
  text-align: center;
  backdrop-filter: blur(4px);

  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.1em;
    color: #f5f5f5;

    @media (max-width: 640px) {
      font-size: 1em;
      margin-bottom: 12px;
    }
  }

  @media (max-width: 640px) {
    padding: 16px;
    margin: 16px 0;
  }
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
      case 'inhale': return 'rgba(76, 175, 80, 0.15)';  // Green
      case 'hold': return 'rgba(255, 193, 7, 0.15)';     // Yellow
      case 'exhale': return 'rgba(244, 67, 54, 0.15)';   // Red
      default: return 'rgba(0, 0, 0, 0.1)';
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
  box-shadow: 0 4px 16px ${props => props.color}30;

  @media (max-width: 640px) {
    width: 140px;
    height: 140px;
    font-size: 1.6em;
    margin-bottom: 16px;
  }
`;

const PhaseText = styled.div`
  font-size: 1em;
  opacity: 0.85;
  margin-bottom: 12px;
  color: #f5f5f5;
  font-weight: 500;

  @media (max-width: 640px) {
    font-size: 0.95em;
    margin-bottom: 10px;
  }
`;

const Count = styled.div`
  font-size: 4em;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  color: #fff;

  @media (max-width: 640px) {
    font-size: 3em;
  }
`;

const Info = styled.div`
  margin-top: 16px;
  font-size: 0.85em;
  opacity: 0.85;
  line-height: 1.6;
  color: #f5f5f5;

  @media (max-width: 640px) {
    font-size: 0.8em;
    margin-top: 12px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-top: 16px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);

  @media (max-width: 640px) {
    height: 5px;
    margin-top: 12px;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.color}99, ${props => props.color});
  width: ${props => props.percent}%;
  transition: width 0.1s linear;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 8px;
    margin-top: 12px;
  }
`;

const Button = styled.button`
  background: ${props => props.color}40;
  border: 1px solid ${props => props.color}99;
  color: #fff;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-family: inherit;

  &:hover:not(:disabled) {
    background: ${props => props.color}60;
    border-color: ${props => props.color};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    padding: 8px 14px;
    font-size: 0.8em;
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
