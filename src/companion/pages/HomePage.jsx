// src/companion/pages/HomePage.jsx

import React from 'react';
import styled from 'styled-components';
import QuoteCarousel from '../../components/widgets/QuoteCarousel/QuoteCarousel';
import Diary from '../../components/widgets/Diary/Diary';
import Panel from '../../components/common/Panel/Panel';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
`;

/**
 * Page d'accueil Companion - Mantras + Diary
 * @renders PageContainer
 * @renders PageTitle
 * @renders Panel
 * @renders QuoteCarousel
 * @renders Diary
 */
const HomePage = () => {
  return (
    <PageContainer>
      <PageTitle>🏠 IMB Companion</PageTitle>

      {/* Mantras */}
      <Panel
        title="Mantras"
        icon="🕉️"
        texture="fabric"
        accentColor="#B8860B"
        contentType="mantras"
        collapsible={true}
        defaultCollapsed={true}
      >
        <QuoteCarousel showCategory={false} infinite={true} random={true} />
      </Panel>

      {/* Journal */}
      <Panel
        title="Journal"
        icon="📔"
        texture="leather"
        accentColor="#4A5568"
        contentType="markdown"
        collapsible={true}
        defaultCollapsed={true}
      >
        <Diary />
      </Panel>
    </PageContainer>
  );
};

export default HomePage;
