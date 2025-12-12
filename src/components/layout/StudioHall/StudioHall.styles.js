// src/components/layout/StudioHall/StudioHall.styles.js

import styled from 'styled-components';

export const SideTowerToggleButton = styled.button`
  position: fixed;
  right: ${({ collapsed }) => collapsed ? '8px' : 'calc(20% - 24px)'};
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 80px;
  background: ${({ theme }) => theme.colors.accents.neutral};
  border: none;
  border-radius: 8px 0 0 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background: ${({ theme }) => theme.colors.accents.warm};
    width: 36px;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

export const StudioContainer = styled.div`
  position: relative;
  display: block;
  height: 100svh;
  width: ${({ sideTowerCollapsed }) => sideTowerCollapsed ? '100%' : '80%'};
  padding: ${({ theme }) => theme.spacing.sm};
  background: black;
  box-sizing: border-box;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;
