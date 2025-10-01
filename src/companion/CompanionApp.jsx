// src/companion/CompanionApp.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import TabBar from './components/TabBar';
import HomePage from './pages/HomePage';
import AtelierPage from './pages/AtelierPage';
import DevPage from './pages/DevPage';
import SettingsPage from './pages/SettingsPage';

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
  padding-bottom: 80px; /* Espace pour TabBar */

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
 */
const CompanionApp = () => {
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
      <TabBar />
    </CompanionContainer>
  );
};

export default CompanionApp;
