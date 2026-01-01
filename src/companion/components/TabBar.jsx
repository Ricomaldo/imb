// src/companion/components/TabBar.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const TabBarContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: ${({ theme }) => theme.colors.primary};
  border-top: ${({ theme }) => `${theme.borders.thick} solid ${theme.colors.border}`};
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.navigation};
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
`;

const TabButton = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3xs']};
  background: none;
  border: none;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.text.light : theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.typography.weights.bold : theme.typography.weights.normal};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  transition: all ${({ theme }) => theme.motion.durations.fast} ${({ theme }) => theme.motion.easings.standard};
  position: relative;

  &:active {
    transform: scale(0.95);
  }

  /* Indicateur actif */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background: ${({ theme }) => theme.colors.accents.gold};
    border-radius: ${({ theme }) => theme.radii.sm};
    opacity: ${({ $active }) => $active ? 1 : 0};
    transition: opacity ${({ theme }) => theme.motion.durations.base} ${({ theme }) => theme.motion.easings.standard};
  }
`;

const TabIcon = styled.span`
  font-size: 24px;
  line-height: 1;
  filter: ${({ $active }) => $active ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' : 'none'};
`;

const TabLabel = styled.span`
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

const tabs = [
  { path: '/home', label: 'Home', icon: '🏠' },
  { path: '/atelier', label: 'Atelier', icon: '⚒️' },
  { path: '/comptoir', label: 'Comptoir', icon: '🧙' },
  { path: '/dev', label: 'Dev', icon: '💡' },
  { path: '/settings', label: 'Config', icon: '⚙️' }
];

/**
 * Barre de navigation inférieure mobile
 * @renders TabBarContainer
 * @renders TabButton
 * @renders TabIcon
 * @renders TabLabel
 */
const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <TabBarContainer>
      {tabs.map(tab => (
        <TabButton
          key={tab.path}
          $active={location.pathname === tab.path || (location.pathname === '/' && tab.path === '/home')}
          onClick={() => navigate(tab.path)}
        >
          <TabIcon $active={location.pathname === tab.path || (location.pathname === '/' && tab.path === '/home')}>
            {tab.icon}
          </TabIcon>
          <TabLabel>{tab.label}</TabLabel>
        </TabButton>
      ))}
    </TabBarContainer>
  );
};

export default TabBar;
