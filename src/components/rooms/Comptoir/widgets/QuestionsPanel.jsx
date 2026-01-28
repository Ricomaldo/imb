import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import styled from 'styled-components';
import { readNote, replaceNote } from '../../../../services/vaultApi';
import MarkdownEditor from '../../../common/MarkdownEditor';

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  opacity: 0.6;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  text-align: center;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  opacity: 0.6;
  font-size: ${({ theme }) => theme.typography.sizes.base};
`;

const getQuestionPath = (questionId, sageIndex) => {
  const question = sageIndex.find(q => q.id === questionId);
  if (question && question.filepath) {
    return question.filepath;
  }
  const domain = questionId.substring(0, questionId.search(/\d/)) || 'unknown';
  return `2-reference/knowledge-base/questions/domaines-v4/${domain}/${questionId}-titre.md`;
};

export const QuestionsPanel = forwardRef(({ sageId, questionIds, sageColor, sageIndex = [] }, ref) => {
  const [questionsContent, setQuestionsContent] = useState({});
  const [loadingQuestions, setLoadingQuestions] = useState(new Set());

  // Expose save method to parent via ref
  useImperativeHandle(ref, () => ({
    saveCurrentQuestion: async (questionId) => {
      const path = getQuestionPath(questionId, sageIndex);
      const content = questionsContent[questionId];
      try {
        await replaceNote(path, content);
        console.log(`[QuestionsPanel] Saved ${questionId}`);
        return true;
      } catch (err) {
        console.error(`[QuestionsPanel] Save error for ${questionId}:`, err);
        alert(`❌ Erreur sauvegarde: ${err.message}`);
        return false;
      }
    }
  }));

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

  if (questionIds.length === 0) {
    return (
      <EmptyState>📖 Sélectionnez une question</EmptyState>
    );
  }

  // Display only the first selected question
  const activeQuestionId = questionIds[0];
  const content = questionsContent[activeQuestionId] || '';
  const isLoading = loadingQuestions.has(activeQuestionId);

  if (isLoading) {
    return <LoadingState>⏳ Chargement...</LoadingState>;
  }

  return (
    <MarkdownEditor
      key={activeQuestionId}
      value={content}
      onChange={newContent => {
        setQuestionsContent(prev => ({
          ...prev,
          [activeQuestionId]: newContent
        }));
      }}
      height="100%"
      compact={true}
      variant="embedded"
      accentColor={sageColor}
    />
  );
});

QuestionsPanel.displayName = 'QuestionsPanel';
