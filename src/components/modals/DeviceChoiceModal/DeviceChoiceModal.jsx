// src/components/modals/DeviceChoiceModal/DeviceChoiceModal.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from '../../common/Modal/Modal';

const ChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  align-items: center;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.light};
  text-align: center;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
`;

const Description = styled.p`
  font-family: ${({ theme }) => theme.typography.families.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  margin: 0;
  max-width: 500px;
`;

const ChoicesRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 600px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ChoiceCard = styled.button`
  flex: 1;
  min-width: 200px;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing['2xl']};
  background: ${({ theme }) => theme.surfaces.base};
  border: ${({ theme }) => `${theme.borders.thick} solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radii.xl};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.durations.base} ${({ theme }) => theme.motion.easings.standard};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.accents.gold};
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const ChoiceIcon = styled.div`
  font-size: 64px;
  line-height: 1;
`;

const ChoiceTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

const ChoiceDescription = styled.p`
  font-family: ${({ theme }) => theme.typography.families.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  margin: 0;
`;

const RememberChoice = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.typography.families.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  user-select: none;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

/**
 * Modale de choix interface Desktop vs Mobile au démarrage
 * @renders Modal
 * @renders ChoiceContainer
 * @renders ChoiceCard
 */
const DeviceChoiceModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [rememberChoice, setRememberChoice] = React.useState(false);

  const handleChoice = (choice) => {
    // Sauvegarder le choix si demandé
    if (rememberChoice) {
      localStorage.setItem('interface-preference', choice);
    }

    // Naviguer vers l'interface choisie
    if (choice === 'mobile') {
      navigate('/companion');
    } else {
      navigate('/');
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choix de l'interface"
      size="medium"
    >
      <ChoiceContainer>
        <div>
          <Title>Bienvenue sur IRIMMetaBrain</Title>
          <Description style={{ marginTop: '16px' }}>
            Nous avons détecté que vous utilisez un appareil mobile.
            Quelle interface souhaitez-vous utiliser ?
          </Description>
        </div>

        <ChoicesRow>
          <ChoiceCard onClick={() => handleChoice('mobile')}>
            <ChoiceIcon>📱</ChoiceIcon>
            <ChoiceTitle>Mobile</ChoiceTitle>
            <ChoiceDescription>
              Interface optimisée pour smartphone et tablette.
              Navigation simplifiée avec tab bar.
            </ChoiceDescription>
          </ChoiceCard>

          <ChoiceCard onClick={() => handleChoice('desktop')}>
            <ChoiceIcon>💻</ChoiceIcon>
            <ChoiceTitle>Desktop</ChoiceTitle>
            <ChoiceDescription>
              Interface complète avec navigation spatiale immersive.
              Toutes les fonctionnalités disponibles.
            </ChoiceDescription>
          </ChoiceCard>
        </ChoicesRow>

        <RememberChoice>
          <input
            type="checkbox"
            checked={rememberChoice}
            onChange={(e) => setRememberChoice(e.target.checked)}
          />
          <span>Se souvenir de mon choix</span>
        </RememberChoice>
      </ChoiceContainer>
    </Modal>
  );
};

export default DeviceChoiceModal;
