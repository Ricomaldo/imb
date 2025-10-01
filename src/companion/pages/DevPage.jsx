// src/companion/pages/DevPage.jsx

import React from 'react';
import styled from 'styled-components';
import MarkdownEditor from '../../components/common/MarkdownEditor/MarkdownEditor';
import useNotesStore from '../../stores/useNotesStore';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  height: calc(100vh - 80px - ${({ theme }) => theme.spacing.md} * 2);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const PageHeader = styled.div`
  text-align: center;
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: ${({ theme }) => `${theme.borders.base} solid ${theme.colors.border}`};
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
`;

const PageSubtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.families.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const EditorWrapper = styled.div`
  flex: 1;
  min-height: 0;
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
`;

/**
 * Page Dev - Notes de développement mobile
 *
 * Sauvegarde automatique :
 * - Chaque changement dans l'éditeur appelle updateCompanionNote()
 * - Zustand persist middleware sauvegarde automatiquement dans localStorage
 * - Aucun bouton "Sauvegarder" nécessaire
 *
 * @renders PageContainer
 * @renders PageHeader
 * @renders PageTitle
 * @renders PageSubtitle
 * @renders EditorWrapper
 * @renders MarkdownEditor
 */
const DevPage = () => {
  const companionNotes = useNotesStore((state) => state.companionNotes);
  const updateCompanionNote = useNotesStore((state) => state.updateCompanionNote);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>💡 Dev Notes</PageTitle>
        <PageSubtitle>Notes de développement synchronisées</PageSubtitle>
      </PageHeader>

      <EditorWrapper>
        <MarkdownEditor
          value={companionNotes?.devNote || ''}
          onChange={(value) => updateCompanionNote('devNote', value)}
          placeholder="# Notes de développement mobile

Capturez vos idées, bugs, et TODOs ici...

## Bugs
- [ ] Bug 1
- [ ] Bug 2

## Features
- [ ] Feature 1

## Notes
..."
          height="100%"
          compact={true}
          variant="embedded"
          accentColor="#4A5568"
        />
      </EditorWrapper>
    </PageContainer>
  );
};

export default DevPage;
