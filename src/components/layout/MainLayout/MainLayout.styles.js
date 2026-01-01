// src/components/layout/MainLayout/MainLayout.styles.js

import styled from 'styled-components';
import { MEDIA_QUERIES } from '../../../utils/responsiveConfig';

/**
 * LayoutWrapper: Conteneur principal FLEXBOX
 * Flex row pour distribution automatique de l'espace
 */
export const LayoutWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100svh;
  width: 100%;
  background: black;
  overflow: hidden;
`;

/**
 * SideTowerToggleButton: Bouton collapse minimaliste
 * Position fixed par rapport au viewport (toujours visible)
 * right: 20% du viewport quand tower visible
 */
export const SideTowerToggleButton = styled.button`
  position: fixed;
  right: ${({ collapsed }) => collapsed ? '0' : '20%'};
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 120px;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 6px 0 0 6px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  z-index: 15; /* Au-dessus SideTower (10), sous modal (30) */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: -3px 0 10px rgba(0, 0, 0, 0.7);
  opacity: 0.9;
  pointer-events: auto;

  &:hover {
    opacity: 1;
    width: 32px;
    background: ${({ theme }) => theme.colors.accents.warm};
    box-shadow: -4px 0 14px rgba(0, 0, 0, 0.9);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  /* Media queries pour responsive */
  @media ${MEDIA_QUERIES.tablet} {
    right: ${({ collapsed }) => collapsed ? '0' : '15%'};
    width: 32px;
    height: 140px;
    font-size: 20px;

    &:hover {
      width: 40px;
    }
  }

  @media ${MEDIA_QUERIES.tabletWide} {
    right: ${({ collapsed }) => collapsed ? '0' : '20%'};
  }
`;

/**
 * MainContent: Zone contenu principale (RoomCanvas)
 * Utilise flex: 1 pour prendre tout l'espace restant
 * S'étend automatiquement quand SideTower collapse
 */
export const MainContent = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.sm};
  background: black;
  box-sizing: border-box;
  transition: flex 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;
