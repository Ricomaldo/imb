// src/components/room-modules/forge/CapturesList.jsx

import React from 'react';
import styled from 'styled-components';
import useProjectMetaStore from '../../../stores/useProjectMetaStore';
import { useProjectData } from '../../../stores/useProjectDataStore';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  height: 100%;
  overflow-y: auto;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const CaptureItem = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
`;

const CaptureContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CaptureHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const CaptureTitle = styled.h4`
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const UrgencyBadge = styled.span`
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  background: ${({ $urgency, theme }) => {
    switch ($urgency) {
      case 'bloquant': return theme.colors.accents.danger;
      case 'genant': return theme.colors.accents.warning;
      case 'cosmetic': return theme.colors.accents.info;
      default: return theme.colors.accents.neutral;
    }
  }};
  color: white;
`;

const CaptureDescription = styled.p`
  font-family: ${({ theme }) => theme.typography.families.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  white-space: pre-wrap;
`;

const Timestamp = styled.span`
  font-family: ${({ theme }) => theme.typography.families.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.accents.danger};
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.muted};
  font-family: ${({ theme }) => theme.typography.families.secondary};
`;

const CapturesList = () => {
  const { selectedProject } = useProjectMetaStore();
  const projectData = useProjectData(selectedProject);

  const bugs = projectData.bugs || [];
  const saveStates = projectData.saveStates || [];

  const handleDelete = (type, id) => {
    const dataKey = type === 'bug' ? 'bugs' : 'saveStates';
    const currentData = projectData[dataKey] || [];
    const updatedData = currentData.filter(item => item.id !== id);
    projectData.updateModuleState(dataKey, updatedData);
  };

  return (
    <Container>
      {/* Bugs Section */}
      <Section>
        <SectionTitle>🐛 Bugs ({bugs.length})</SectionTitle>
        {bugs.length === 0 ? (
          <EmptyState>Aucun bug capturé</EmptyState>
        ) : (
          bugs.map((bug) => (
            <CaptureItem key={bug.id}>
              <CaptureContent>
                <CaptureHeader>
                  <CaptureTitle>{bug.title}</CaptureTitle>
                  <UrgencyBadge $urgency={bug.urgency}>
                    {bug.urgency === 'bloquant' && '🔴 Bloquant'}
                    {bug.urgency === 'genant' && '🟡 Gênant'}
                    {bug.urgency === 'cosmetic' && '🔵 Cosmétique'}
                  </UrgencyBadge>
                </CaptureHeader>
                <CaptureDescription>{bug.description}</CaptureDescription>
                <Timestamp>📅 {bug.timestamp}</Timestamp>
              </CaptureContent>
              <DeleteButton
                onClick={() => handleDelete('bug', bug.id)}
                title="Supprimer ce bug"
              >
                ❌
              </DeleteButton>
            </CaptureItem>
          ))
        )}
      </Section>

      {/* Save States Section */}
      <Section>
        <SectionTitle>💾 Pauses Projet ({saveStates.length})</SectionTitle>
        {saveStates.length === 0 ? (
          <EmptyState>Aucune pause sauvegardée</EmptyState>
        ) : (
          saveStates.map((saveState) => (
            <CaptureItem key={saveState.id}>
              <CaptureContent>
                <CaptureHeader>
                  <CaptureTitle>{saveState.title}</CaptureTitle>
                </CaptureHeader>
                <CaptureDescription>{saveState.description}</CaptureDescription>
                {saveState.nextAction && (
                  <CaptureDescription>
                    <strong>➡️ Prochaine étape :</strong> {saveState.nextAction}
                  </CaptureDescription>
                )}
                <Timestamp>📅 {saveState.timestamp}</Timestamp>
              </CaptureContent>
              <DeleteButton
                onClick={() => handleDelete('saveState', saveState.id)}
                title="Supprimer cette pause"
              >
                ❌
              </DeleteButton>
            </CaptureItem>
          ))
        )}
      </Section>
    </Container>
  );
};

export default CapturesList;
