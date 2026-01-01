import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { readNote, replaceNote } from '../../../../services/vaultApi';
import MarkdownEditor from '../../../common/MarkdownEditor';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LoadingState = styled.div`
  opacity: 0.6;
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  opacity: 0.6;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  text-align: center;
`;

const ToolbarContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ToolbarButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: ${({ $variant, theme }) =>
    $variant === 'save' ? theme.colors.accents.warm : 'rgba(255, 255, 255, 0.05)'};
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  transition: ${({ theme }) =>
    `all ${theme.motion.durations.fast} ${theme.motion.easings.standard}`};

  &:hover:not(:disabled) {
    background: ${({ $variant, theme }) =>
      $variant === 'save'
        ? theme.colors.accents.warm
        : 'rgba(255, 255, 255, 0.1)'};
    border-color: rgba(255, 255, 255, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const getQuestionPath = (questionId, sageIndex) => {
  // Find filepath from sageIndex (populated from vault index)
  const question = sageIndex.find(q => q.id === questionId);
  if (question && question.filepath) {
    return question.filepath;
  }

  // Fallback: construct path if not found in index
  const domain = questionId.substring(0, questionId.search(/\d/)) || 'unknown';
  return `1-knowledge-base/questions/domaines-v4/${domain}/${questionId}-titre.md`;
};

export const QuestionsPanel = ({ sageId, questionIds, sageColor, sageIndex = [] }) => {
  const [questionsContent, setQuestionsContent] = useState({});
  const [editingMode, setEditingMode] = useState({});
  const [isSaving, setIsSaving] = useState({});
  const [contentModified, setContentModified] = useState({});
  const [loadingQuestions, setLoadingQuestions] = useState(new Set());

  // Load content for selected questions
  useEffect(() => {
    questionIds.forEach(qId => {
      if (!questionsContent[qId] && !loadingQuestions.has(qId)) {
        setLoadingQuestions(prev => new Set([...prev, qId]));

        const path = getQuestionPath(qId, sageIndex);
        readNote(path)
          .then(content => {
            setQuestionsContent(prev => ({
              ...prev,
              [qId]: content
            }));
          })
          .catch(err => {
            console.error(`[QuestionsPanel] Error loading ${qId}:`, err);
            setQuestionsContent(prev => ({
              ...prev,
              [qId]: `[ERREUR] Impossible de charger la question ${qId}`
            }));
          })
          .finally(() => {
            setLoadingQuestions(prev => {
              const next = new Set(prev);
              next.delete(qId);
              return next;
            });
          });
      }
    });
  }, [questionIds, sageIndex]);

  const handleSaveQuestion = async (questionId) => {
    const path = getQuestionPath(questionId, sageIndex);
    const content = questionsContent[questionId];

    setIsSaving(prev => ({ ...prev, [questionId]: true }));

    try {
      await replaceNote(path, content);
      setEditingMode(prev => ({ ...prev, [questionId]: false }));
      setContentModified(prev => ({ ...prev, [questionId]: false }));
      console.log(`[QuestionsPanel] Saved ${questionId}`);
    } catch (err) {
      console.error(`[QuestionsPanel] Save error for ${questionId}:`, err);
      alert(`❌ Erreur sauvegarde: ${err.message}`);
    } finally {
      setIsSaving(prev => ({ ...prev, [questionId]: false }));
    }
  };

  if (questionIds.length === 0) {
    return (
      <EmptyState>📖 Sélectionnez une question pour voir le contenu</EmptyState>
    );
  }

  // Display only the first selected question
  const activeQuestionId = questionIds[0];
  const isEditing = editingMode[activeQuestionId] || false;
  const isSavingNow = isSaving[activeQuestionId] || false;
  const isModified = contentModified[activeQuestionId] || false;
  const content = questionsContent[activeQuestionId] || '';
  const isLoading = loadingQuestions.has(activeQuestionId);

  return (
    <EditorContainer>
      {isLoading ? (
        <LoadingState>⏳ Chargement...</LoadingState>
      ) : (
        <>
          <MarkdownEditor
            key={`editor-${activeQuestionId}-${isEditing}`}
            value={content}
            onChange={newContent => {
              setQuestionsContent(prev => ({
                ...prev,
                [activeQuestionId]: newContent
              }));
              setContentModified(prev => ({
                ...prev,
                [activeQuestionId]: true
              }));
            }}
            readOnly={!isEditing}
            height="300px"
            compact={true}
            variant="embedded"
            accentColor={sageColor}
          />

          <ToolbarContainer>
            <ToolbarButton
              onClick={() =>
                setEditingMode(prev => ({
                  ...prev,
                  [activeQuestionId]: !prev[activeQuestionId]
                }))
              }
              disabled={isSavingNow || isLoading}
            >
              {isEditing ? '👁️ Lire' : '✏️ Éditer'}
            </ToolbarButton>

            {isEditing && (
              <ToolbarButton
                $variant="save"
                onClick={() => handleSaveQuestion(activeQuestionId)}
                disabled={isSavingNow || !isModified || isLoading}
              >
                {isSavingNow ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
              </ToolbarButton>
            )}
          </ToolbarContainer>
        </>
      )}
    </EditorContainer>
  );
};
