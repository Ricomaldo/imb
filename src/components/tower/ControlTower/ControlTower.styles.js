// src/components/tower/ControlTower/ControlTower.styles.js

import styled from "styled-components";
import {
  metalBg,
  craftBorderHeavy,
  primaryLevel,
} from "../../../styles/mixins";

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
