// src/companion/CompanionApp.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import TabBar from './components/TabBar';
import HomePage from './pages/HomePage';
import AtelierPage from './pages/AtelierPage';
import DevPage from './pages/DevPage';
import SettingsPage from './pages/SettingsPage';
import { useSyncStatus } from '../contexts/SyncContext';

const CompanionContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: 100px; /* Espace pour TabBar + SyncIndicator */

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.sm};

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
    }
  }
`;

// Animations pour l'indicateur de sync
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const SyncIndicatorBar = styled.div`
  position: fixed;
  bottom: 70px; /* Au-dessus de la TabBar */
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  font-family: 'Orbitron', monospace;
  font-size: 11px;
  color: ${({ $status }) => {
    switch ($status) {
      case 'success': return '#27ae60';
      case 'syncing': return '#f39c12';
      case 'pending': return '#f39c12';
      case 'error': return '#e74c3c';
      case 'offline': return '#95a5a6';
      default: return '#888';
    }
  }};

  .sync-icon {
    font-size: 14px;
    ${({ $status }) => $status === 'syncing' && css`
      animation: ${spin} 1s linear infinite;
    `}
    ${({ $status }) => $status === 'pending' && css`
      animation: ${pulse} 1.5s ease-in-out infinite;
    `}
  }

  .sync-text {
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
`;

/**
 * Application Companion mobile
 * @renders CompanionContainer
 * @renders ContentArea
 * @renders Routes
 * @renders TabBar
 * @renders HomePage
 * @renders AtelierPage
 * @renders DevPage
 * @renders SettingsPage
 * @renders SyncIndicatorBar
 */
const CompanionApp = () => {
  const { syncStatus, isConfigured } = useSyncStatus();

  // Helper pour afficher l'icône et texte du sync
  const getSyncDisplay = () => {
    if (!isConfigured) return { icon: '⚠️', text: 'No sync' };

    switch (syncStatus) {
      case 'syncing':
        return { icon: '🔄', text: 'Syncing' };
      case 'pending':
        return { icon: '⏳', text: 'Pending' };
      case 'success':
        return { icon: '✓', text: 'Synced' };
      case 'error':
        return { icon: '✗', text: 'Error' };
      case 'offline':
        return { icon: '📴', text: 'Offline' };
      default:
        return { icon: '☁️', text: 'Ready' };
    }
  };

  const syncDisplay = getSyncDisplay();

  return (
    <CompanionContainer>
      <ContentArea>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/atelier" element={<AtelierPage />} />
          <Route path="/dev" element={<DevPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </ContentArea>

      {/* Indicateur de sync centré au-dessus de la TabBar */}
      <SyncIndicatorBar $status={syncStatus} title={`Sync: ${syncStatus}`}>
        <span className="sync-icon">{syncDisplay.icon}</span>
        <span className="sync-text">{syncDisplay.text}</span>
      </SyncIndicatorBar>

      <TabBar />
    </CompanionContainer>
  );
};

export default CompanionApp;
