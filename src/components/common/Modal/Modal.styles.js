// src/components/common/Modal/Modal.styles.js - Styles pour le système de modales

import styled, { keyframes, css } from 'styled-components';
import { alpha } from '../../../styles/color';
import { metalBg, primaryLevel } from '../../../styles/mixins';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Overlay adaptable selon variante
export const ModalOverlay = styled.div`
  position: fixed;
  z-index: ${({ theme, $variant }) =>
    $variant === 'overlay' ? (theme.zIndex.modalTop || 10000) : theme.zIndex.modal
  };
  animation: ${fadeIn} 0.2s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $variant, theme }) => {
    if ($variant === 'roomCanvas') {
      // Positionné exactement sur RoomCanvas
      return css`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${theme.colors.black}; /* Fond opaque pour cacher RoomCanvas */
        border-radius: ${theme.radii.xl};
        z-index: 100; /* Au-dessus du contenu mais sous les autres modales */
      `;
    } else if ($variant === 'baseFloorTower') {
      // Positionné sur l'étage de base de SideTower
      return css`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${theme.colors.black}; /* Fond opaque */
        border-radius: ${theme.radii.xl};
        z-index: 100;
      `;
    } else {
      // Mode overlay classique (plein écran)
      return css`
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${alpha(theme.colors.black, 0.7)};
        backdrop-filter: blur(8px);
      `;
    }
  }}
`;

// Container de la modal - Adapté selon variante
export const ModalContainer = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.xl};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${({ $variant, $size }) => {
    if ($variant === 'roomCanvas') {
      // Version qui remplace complètement RoomCanvas
      return css`
        ${metalBg}
        ${primaryLevel}
        width: 100%;
        height: 100%;
        background-blend-mode: multiply;
        animation: ${fadeIn} 0.3s ease-out; /* Pas de slide, juste fadeIn */
        /* TEST-MEDIEVAL-UI: Bordure dorée visible avec box-shadow */
        box-shadow:
          inset 0 0 0 3px #b1845a,
          inset 0 0 0 5px rgba(240, 222, 186, 0.3),
          0 0 20px rgba(177, 132, 90, 0.2);
      `;
    } else if ($variant === 'baseFloorTower') {
      // Version qui remplace l'étage de base (BottomTowerFloor)
      return css`
        ${metalBg}
        ${primaryLevel}
        width: 100%;
        height: 100%;
        background-blend-mode: multiply;
        animation: ${fadeIn} 0.3s ease-out;
      `;
    } else {
      // Version modale classique
      return css`
        ${metalBg}
        ${primaryLevel}
        background-blend-mode: multiply;
        animation: ${fadeIn} 0.3s ease-out;

        width: ${(() => {
          switch ($size) {
            case 'small': return '500px';
            case 'large': return '85%';
            case 'fullscreen': return '95%';
            default: return '750px'; // medium
          }
        })()};

        max-width: 90%;
        max-height: 85%;
      `;
    }
  }}
`;

// Header de la modal - Style Tower/Control
export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: ${({ theme }) => alpha(theme.colors.primary, 0.2)};
  border-bottom: ${({ theme }) => `${theme.borders.base} solid ${theme.colors.border}`};
  backdrop-filter: blur(4px);
`;

export const ModalTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.light};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
  margin: 0;
  text-shadow: 2px 2px 4px ${({ theme }) => alpha(theme.colors.black, 0.5)};
`;

// Bouton fermer - Style IconButton Tower
export const ModalCloseButton = styled.button`
  width: ${({ theme }) => theme.button.small};
  height: ${({ theme }) => theme.button.small};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.stone};
  border: ${({ theme }) => `${theme.borders.base} solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.light};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  cursor: pointer;
  transition: ${({ theme }) => `all ${theme.motion.durations.base} ${theme.motion.easings.standard}`};

  &:hover {
    background: ${({ theme }) => theme.colors.accents.danger};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px ${({ theme }) => alpha(theme.colors.black, 0.3)};
  }

  &:active {
    transform: translateY(0);
  }
`;

// Contenu scrollable
export const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => alpha(theme.colors.secondary, 0.3)};

  /* Custom scrollbar style Tower */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => alpha(theme.colors.black, 0.2)};
    border-radius: ${({ theme }) => theme.radii.sm};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.sm};

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
    }
  }
`;

// Footer optionnel pour actions
export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => alpha(theme.colors.primary, 0.2)};
  border-top: ${({ theme }) => `${theme.borders.base} solid ${theme.colors.border}`};
`;

// Bouton de fermeture intégré au contenu
export const ModalActionButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.accents.primary :
    $variant === 'danger' ? theme.colors.accents.danger :
    theme.colors.stone
  };
  color: ${({ theme }) => theme.colors.text.light};
  border: ${({ theme }) => `${theme.borders.base} solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  transition: ${({ theme }) => `all ${theme.motion.durations.base} ${theme.motion.easings.standard}`};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px ${({ theme }) => alpha(theme.colors.black, 0.3)};
  }

  &:active {
    transform: translateY(0);
  }
`;