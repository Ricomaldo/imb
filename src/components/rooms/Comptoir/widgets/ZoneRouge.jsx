import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { RespirationTimer } from './RespirationTimer';
import protocoleData from '../../../../data/protocoleZoneRouge.json';
import useSagesStore from '../../../../stores/useSagesStore';
import sagesData from '../../../../data/sagesConfig.json';

const TriggerButton = styled.button`
  background: linear-gradient(135deg, #FF6B6B, #FF8E72);
  border: 2px solid #FF6B6B;
  border-radius: 8px;
  color: #fff;
  padding: 12px 20px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: center;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 16px rgba(255, 107, 107, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a1a1a 100%);
  border: 3px solid #FF6B6B;
  border-radius: 16px;
  padding: 30px;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  color: #fff;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);

  h2 {
    color: #FF8E72;
    margin-top: 0;
    text-align: center;
    font-size: 1.5em;
  }

  h3 {
    color: #FFB3AC;
    margin-top: 20px;
    font-size: 1.1em;
  }
`;

const StepsContainer = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Step = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border-left: 3px solid #FF8E72;
  padding: 12px;
  border-radius: 4px;
  font-size: 0.9em;
  line-height: 1.5;

  strong {
    color: #FFB3AC;
  }
`;

const MantrasContainer = styled.div`
  background: rgba(255, 107, 107, 0.08);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MantraText = styled.p`
  font-size: 1.05em;
  font-style: italic;
  text-align: center;
  margin: 0;
  opacity: 0.95;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  flex: 1;
  min-width: 120px;
  background: ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #FF8E72, #FF6B6B)'};
  border: 2px solid ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.2)' : '#FF8E72'};
  color: #fff;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.85em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ZoneRouge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState('intro'); // intro | timer | mantras | post
  const [currentMantraIndex, setCurrentMantraIndex] = useState(0);
  const { selectSage, addHistory } = useSagesStore();
  const meridian = sagesData.sages.find(s => s.id === 'meridian');

  const handleOpenZoneRouge = () => {
    setIsOpen(true);
    setPhase('intro');
    setCurrentMantraIndex(0);
  };

  const handleStartTimer = () => {
    setPhase('timer');
  };

  const handleTimerComplete = () => {
    setPhase('post');
  };

  const handleNextMantra = () => {
    setCurrentMantraIndex(prev => (prev + 1) % protocoleData.mantras.length);
  };

  const handleContactMeridian = () => {
    // Open Meridian modal and create handoff option
    selectSage('meridian');
    addHistory('meridian');
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return <TriggerButton onClick={handleOpenZoneRouge}>🔴 ZONE ROUGE</TriggerButton>;
  }

  return createPortal(
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>🔴 Zone Rouge</h2>

        {phase === 'intro' && (
          <>
            <p>Protocole d'urgence pour crises d'anxiété / saturation / urgence émotionnelle.</p>

            <h3>📋 Étapes</h3>
            <StepsContainer>
              {protocoleData.steps.map(step => (
                <Step key={step.num}>
                  <strong>Étape {step.num}: {step.title}</strong>
                  <div>{step.description}</div>
                </Step>
              ))}
            </StepsContainer>

            <Button onClick={handleStartTimer}>
              ▶️ Démarrer Protocole
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
          </>
        )}

        {phase === 'timer' && (
          <>
            <RespirationTimer
              pattern={protocoleData.respirationPattern}
              color="#FF8E72"
              onComplete={handleTimerComplete}
            />

            <h3>💬 Mantras Meridian</h3>
            <MantrasContainer>
              <MantraText>"{protocoleData.mantras[currentMantraIndex]}"</MantraText>
            </MantrasContainer>

            <div style={{ textAlign: 'center', fontSize: '0.85em', opacity: '0.7' }}>
              Mantra {currentMantraIndex + 1} / {protocoleData.mantras.length}
            </div>

            <Button onClick={handleNextMantra} style={{ marginTop: '10px' }}>
              → Suivant
            </Button>
          </>
        )}

        {phase === 'post' && (
          <>
            <h3 style={{ color: '#4CAF50' }}>✅ Protocole Terminé</h3>
            <p>
              {protocoleData.respirationPattern.cycles} cycles respiratoires complétés.
              Tu as régulé ton système nerveux.
            </p>

            <h3>📝 Prochaines Actions</h3>
            <StepsContainer>
              <Step>
                <strong>📞 Parler avec Meridian</strong>
                <div>Créer un handoff pour débriefing & intégration post-crise</div>
              </Step>
              <Step>
                <strong>📔 Noter dans Diary</strong>
                <div>Capturer ce qui s'est passé (optionnel mais recommandé)</div>
              </Step>
              <Step>
                <strong>↩️ Reprendre activité</strong>
                <div>Recommencer lentement. Pas d'urgence.</div>
              </Step>
            </StepsContainer>

            <ButtonGroup>
              <Button onClick={handleContactMeridian}>
                {meridian?.emoji} Contacter {meridian?.name}
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Retour
              </Button>
            </ButtonGroup>
          </>
        )}
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};
