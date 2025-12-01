// src/components/tower/ControlTower/ControlTower.styles.js

import styled, { keyframes } from "styled-components";
import {
  metalBg,
  craftBorderHeavy,
  primaryLevel,
} from "../../../styles/mixins";

// Animation pour le spinner de sync
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const TowerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  ${metalBg}
  ${primaryLevel}
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
`;

export const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-items: center;
`;

export const BottomRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
  justify-items: center;
`;

export const CenterRect = styled.div`
  ${craftBorderHeavy}
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #111111;
  color: ${({ theme }) => theme.colors.text.light};
  width: 100%;
  height: ${({ theme }) => theme.button.large};
  padding: ${({ theme }) => theme.spacing.xs};
  text-align: center;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
`;

export const TimeDisplay = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: 700;
  font-family: 'Orbitron', monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
  line-height: 1;
  margin: 0;
  padding: 0;
  color: ${({ theme }) => theme.colors.text.light};
  min-width: 160px;
`;

export const DateDisplay = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 700;
  font-family: 'Orbitron', monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.12em;
  line-height: 1.2;
  margin: 0;
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding: 0;
  min-width: 160px;

  .year {
    color: ${({ theme }) => theme.colors.text.muted};
    opacity: 0.7;
  }

  .month {
    color: ${({ theme }) => theme.colors.text.light};
    opacity: 0.85;
  }

  .day {
    color: ${({ theme }) => theme.colors.text.light};
  }

  .separator {
    color: ${({ theme }) => theme.colors.text.muted};
    opacity: 0.4;
    margin: 0 2px;
  }
`;

// Indicateur de synchronisation
export const SyncIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-family: 'Orbitron', monospace;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  color: ${({ $status, theme }) => {
    switch ($status) {
      case 'success': return '#27ae60';
      case 'syncing': return '#f39c12';
      case 'pending': return '#f39c12';
      case 'error': return '#e74c3c';
      case 'offline': return '#95a5a6';
      default: return theme.colors.text.muted;
    }
  }};

  .sync-icon {
    font-size: 10px;
    ${({ $status }) => $status === 'syncing' && `
      animation: ${spin} 1s linear infinite;
    `}
    ${({ $status }) => $status === 'pending' && `
      animation: ${pulse} 1.5s ease-in-out infinite;
    `}
  }

  .sync-text {
    font-size: 9px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
`;
