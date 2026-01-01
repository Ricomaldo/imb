import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { readNote, replaceNote } from '../../../../services/vaultApi';
import MarkdownEditor from '../../../common/MarkdownEditor';

const QuestionsPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const QuestionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(0, 0, 0, 0.1);
  border-left: 3px solid ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.radii.sm};
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  h4 {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.sizes.base};
    color: #fff;
    flex: 1;
  }

  strong {
    color: ${({ $color }) => $color};
    font-weight: bold;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({ $variant, $color }) => {
    if ($variant === 'save') return $color;
    return 'rgba(0, 0, 0, 0.2)';
  }};
  border: 1px solid ${({ $color }) => $color}33;
  color: #fff;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  cursor: pointer;
  transition: ${({ theme }) =>
    `all ${theme.motion.durations.fast} ${theme.motion.easings.standard}`};

  &:hover {
    background: ${({ $variant, $color }) => {
      if ($variant === 'save') return $color;
      return 'rgba(0, 0, 0, 0.3)';
    }};
    border-color: ${({ $color }) => $color}66;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  height: 200px;
  opacity: 0.6;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  text-align: center;
`;

const parseQuestionsFromMarkdown = (content) => {
  const questions = [];
  const questionRegex = /###\s+\[([A-Z0-9]+)\]\s+(.+?)(?:\n|$)/g;

  let match;
  while ((match = questionRegex.exec(content)) !== null) {
    const questionId = match[1];
    const titleAndDescription = match[2];

    const titleMatch = titleAndDescription.match(/^([^-]+)(?:\s*-\s*(.+))?$/);
    const title = titleMatch ? titleMatch[1].trim() : titleAndDescription;

    questions.push({
      id: questionId,
      title: title.trim(),
      domain: questionId.substring(0, questionId.search(/\d/)) || 'unknown'
    });
  }

  return questions;
};

const getQuestionPath = (sageId, questionId) => {
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

        const path = getQuestionPath(sageId, qId);
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
  }, [questionIds, sageId]);

  const handleSaveQuestion = async (questionId) => {
    const path = getQuestionPath(sageId, questionId);
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

  return (
    <QuestionsPanelContainer>
      {questionIds.map(questionId => {
        const isEditing = editingMode[questionId] || false;
        const isSavingNow = isSaving[questionId] || false;
        const isModified = contentModified[questionId] || false;
        const content = questionsContent[questionId] || '';
        const isLoading = loadingQuestions.has(questionId);

        // Find question from index for title
        const questionData = sageIndex.find(q => q.id === questionId) || {
          id: questionId,
          title: questionId
        };

        return (
          <QuestionSection key={questionId} $color={sageColor}>
            <QuestionHeader $color={sageColor}>
              <h4>
                <strong>{questionData.id}</strong> {questionData.title}
              </h4>
            </QuestionHeader>

            {isLoading ? (
              <LoadingState>⏳ Chargement...</LoadingState>
            ) : (
              <>
                <MarkdownEditor
                  key={`editor-${questionId}-${isEditing}`}
                  value={content}
                  onChange={newContent => {
                    setQuestionsContent(prev => ({
                      ...prev,
                      [questionId]: newContent
                    }));
                    setContentModified(prev => ({
                      ...prev,
                      [questionId]: true
                    }));
                  }}
                  readOnly={!isEditing}
                  height="250px"
                  compact={true}
                  variant="embedded"
                  accentColor={sageColor}
                />

                <ActionButtons>
                  <ActionButton
                    $color={sageColor}
                    onClick={() =>
                      setEditingMode(prev => ({
                        ...prev,
                        [questionId]: !prev[questionId]
                      }))
                    }
                    disabled={isSavingNow || isLoading}
                  >
                    {isEditing ? '👁️ Lire' : '✏️ Éditer'}
                  </ActionButton>

                  {isEditing && (
                    <ActionButton
                      $variant="save"
                      $color={sageColor}
                      onClick={() => handleSaveQuestion(questionId)}
                      disabled={isSavingNow || !isModified || isLoading}
                    >
                      {isSavingNow ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
                    </ActionButton>
                  )}
                </ActionButtons>
              </>
            )}
          </QuestionSection>
        );
      })}
    </QuestionsPanelContainer>
  );
};
