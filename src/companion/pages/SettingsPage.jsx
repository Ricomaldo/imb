// src/companion/pages/SettingsPage.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/common/Button/Button';
import { openModal } from '../../utils/buttonMapping';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
`;

const Section = styled.div`
  background: ${({ theme }) => theme.surfaces.base};
  border: ${({ theme }) => `${theme.borders.thick} solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.surfaces.muted};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const InfoLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.families.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const InfoValue = styled.span`
  font-family: ${({ theme }) => theme.typography.families.mono};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  background: ${({ $status, theme }) =>
    $status === 'success'
      ? theme.colors.accents.success
      : $status === 'syncing'
      ? theme.colors.accents.cold
      : theme.colors.stone};
  color: ${({ theme }) => theme.colors.text.light};
`;

const Description = styled.p`
  font-family: ${({ theme }) => theme.typography.families.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  margin: 0;
`;

/**
 * Page Settings - Configuration et synchronisation
 * @renders PageContainer
 * @renders PageTitle
 * @renders Section
 * @renders SectionTitle
 * @renders SectionContent
 * @renders InfoRow
 * @renders Button
 * @renders StatusBadge
 * @renders Description
 */
const SettingsPage = () => {
  const [syncStatus, _setSyncStatus] = useState('idle');

  const handleOpenSyncModal = () => {
    openModal('sync');
  };

  const handleResetInterfaceChoice = () => {
    localStorage.removeItem('interface-preference');
    alert('✅ Choix d\'interface réinitialisé. Rechargez la page pour choisir à nouveau.');
  };

  const lastSync = localStorage.getItem('last-sync');
  const lastSyncDate = lastSync ? new Date(lastSync).toLocaleString('fr-FR') : 'Jamais';
  const interfacePreference = localStorage.getItem('interface-preference');

  return (
    <PageContainer>
      <PageTitle>⚙️ Configuration</PageTitle>

      {/* Section Synchronisation */}
      <Section>
        <SectionTitle>
          <span>☁️</span>
          <span>Synchronisation</span>
        </SectionTitle>
        <SectionContent>
          <Description>
            Synchronisez vos données avec GitHub Gist pour les retrouver sur tous vos appareils.
            Vos notes sont chiffrées avant envoi.
          </Description>

          <InfoRow>
            <InfoLabel>État</InfoLabel>
            <StatusBadge $status={syncStatus}>
              {syncStatus === 'success' ? '✅ Synchronisé' : '⏸️ En attente'}
            </StatusBadge>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Dernière sync</InfoLabel>
            <InfoValue>{lastSyncDate}</InfoValue>
          </InfoRow>

          <Button onClick={handleOpenSyncModal} disabled={syncStatus === 'syncing'}>
            {syncStatus === 'syncing' ? 'Synchronisation...' : 'Configurer la synchronisation'}
          </Button>
        </SectionContent>
      </Section>

      {/* Section Application */}
      <Section>
        <SectionTitle>
          <span>ℹ️</span>
          <span>Application</span>
        </SectionTitle>
        <SectionContent>
          <InfoRow>
            <InfoLabel>Version</InfoLabel>
            <InfoValue>1.0.0-mvp</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Mode</InfoLabel>
            <InfoValue>Mobile Companion</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Plateforme</InfoLabel>
            <InfoValue>
              {navigator.userAgent.includes('Mobile') ? '📱 Mobile' : '💻 Desktop'}
            </InfoValue>
          </InfoRow>

          <Description>
            IMB Companion est l'interface mobile optimisée de IRIMMetaBrain.
            Accédez à vos mantras, notes et synchronisation en déplacement.
          </Description>
        </SectionContent>
      </Section>

      {/* Section Stockage */}
      <Section>
        <SectionTitle>
          <span>💾</span>
          <span>Stockage</span>
        </SectionTitle>
        <SectionContent>
          <InfoRow>
            <InfoLabel>Stockage local</InfoLabel>
            <InfoValue>LocalStorage</InfoValue>
          </InfoRow>

          <Description>
            Vos données sont sauvegardées localement dans votre navigateur.
            Activez la synchronisation pour les sauvegarder dans le cloud.
          </Description>
        </SectionContent>
      </Section>

      {/* Section Préférences Interface */}
      {interfacePreference && (
        <Section>
          <SectionTitle>
            <span>🎨</span>
            <span>Préférences</span>
          </SectionTitle>
          <SectionContent>
            <InfoRow>
              <InfoLabel>Interface préférée</InfoLabel>
              <InfoValue>{interfacePreference === 'mobile' ? 'Mobile 📱' : 'Desktop 💻'}</InfoValue>
            </InfoRow>

            <Description>
              Vous avez choisi de toujours utiliser l'interface {interfacePreference}.
              Vous pouvez réinitialiser ce choix ci-dessous.
            </Description>

            <Button onClick={handleResetInterfaceChoice}>
              Réinitialiser le choix
            </Button>
          </SectionContent>
        </Section>
      )}
    </PageContainer>
  );
};

export default SettingsPage;
