// src/components/layout/SideTower/SideTower.styles.js

import styled from 'styled-components';
import { craftBorder, stoneBg } from '../../../styles/mixins';

export const TowerWrapper = styled.div`
  position: fixed;
  right: ${({ theme }) => theme.spacing.sm};
  top: ${({ theme }) => theme.spacing.sm};
  bottom: ${({ theme }) => theme.spacing.sm};
  width: calc(20% - ${({ theme }) => theme.spacing.sm});
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  transform: translateX(${({ collapsed }) => collapsed ? '100%' : '0'});
  opacity: ${({ collapsed }) => collapsed ? '0' : '1'};
  visibility: ${({ collapsed }) => collapsed ? 'hidden' : 'visible'};
  pointer-events: ${({ collapsed }) => collapsed ? 'none' : 'auto'};
`;

export const TowerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 3fr 320px;
  gap: ${({ theme }) => theme.spacing.sm};
  ${craftBorder}
  ${stoneBg}
  padding: ${({ theme }) => theme.spacing.sm};
`;

// Wrapper pour l'étage supérieur (ControlTower)
export const TopTowerFloor = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
`;

// Wrapper pour l'étage du milieu (WorkbenchDrawer)
export const MiddleTowerFloor = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  overflow: hidden;
`;

// Wrapper pour l'étage inférieur (SideTowerNotes)
export const BottomTowerFloor = styled.div`
  position: relative; /* Important pour que les modales positionnées dedans fonctionnent */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  overflow: hidden;
`;