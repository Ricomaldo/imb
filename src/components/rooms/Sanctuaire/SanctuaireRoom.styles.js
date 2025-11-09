// src/components/rooms/Sanctuaire/SanctuaireRoom.styles.js

import styled from 'styled-components';
import { alpha } from '../../../styles/color';

/* TEST-MEDIEVAL-UI: Wrapper avec background bleu nuit premium */
export const SanctuaireWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.gradients.uiKitBlue};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  position: relative;

  /* Overlay doré très subtil */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.gradients.goldShine};
    opacity: 0.03;
    pointer-events: none;
    border-radius: ${({ theme }) => theme.radii.xl};
  }

  /* Ombre intérieure pour profondeur */
  box-shadow:
    inset 0 2px 10px ${alpha('#000000', 0.3)},
    inset 0 0 30px ${alpha('#111629', 0.4)};
`;

export const SanctuaireGrid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: 1fr 1fr 2fr;
  gap: ${({ theme }) => theme.spacing.xl};
  position: relative;
  z-index: 1; /* Au-dessus de l'overlay */
`;
