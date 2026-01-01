// src/components/layout/SideTower/SideTower.styles.js

import styled from 'styled-components';
import { craftBorder, stoneBg } from '../../../styles/mixins';
import { MEDIA_QUERIES } from '../../../utils/responsiveConfig';

/**
 * TowerWrapper: Flex child responsive sans min-width
 * Desktop: 20%, Tablet: 15%
 * Pas de min-width pour éviter overflow sur petites fenêtres
 * Le contenu scroll si nécessaire
 */
export const TowerWrapper = styled.div`
  position: relative;
  flex: 0 0 auto;
  height: 100%;
  width: ${({ $collapsed }) => $collapsed ? '0' : '20%'};
  z-index: 10; /* theme.zIndex.navigation */
  background: black;
  overflow: hidden;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  opacity: ${({ $collapsed }) => $collapsed ? '0' : '1'};
  visibility: ${({ $collapsed }) => $collapsed ? 'hidden' : 'visible'};
  pointer-events: ${({ $collapsed }) => $collapsed ? 'none' : 'auto'};

  /* Media queries pour responsive */
  @media ${MEDIA_QUERIES.tablet} {
    width: ${({ $collapsed }) => $collapsed ? '0' : '15%'};
  }

  @media ${MEDIA_QUERIES.tabletWide} {
    width: ${({ $collapsed }) => $collapsed ? '0' : '20%'};
  }
`;

export const TowerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: ${({ $responsiveLevel }) => {
    // Desktop (default): auto 3fr 320px
    // Tablet: auto 2fr 280px
    return $responsiveLevel === 'tablet' ? 'auto 2fr 280px' : 'auto 3fr 320px';
  }};
  gap: ${({ theme }) => theme.spacing.sm};
  ${craftBorder}
  ${stoneBg}
  padding: ${({ theme }) => theme.spacing.sm};
  box-sizing: border-box;
  overflow: hidden;

  /* Media queries pour fallback */
  @media ${MEDIA_QUERIES.tablet} {
    grid-template-rows: auto 2fr 280px;
  }

  @media ${MEDIA_QUERIES.tabletWide} {
    grid-template-rows: auto 3fr 320px;
  }
`;

// Wrapper pour l'étage supérieur (ControlTower)
export const TopTowerFloor = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  overflow: auto; /* Scroll si contenu trop large */
`;

// Wrapper pour l'étage du milieu (WorkbenchDrawer)
export const MiddleTowerFloor = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  overflow: auto; /* Scroll si contenu trop large */
`;

// Wrapper pour l'étage inférieur (SideTowerNotes)
export const BottomTowerFloor = styled.div`
  position: relative; /* Important pour que les modales positionnées dedans fonctionnent */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  overflow: auto; /* Scroll si contenu trop large */
`;