import React from 'react';
import styled from 'styled-components';

const QuestionSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  box-sizing: border-box;
  max-height: 200px;
  overflow-y: auto;
`;

const QuestionItemLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: ${({ theme }) =>
    `background ${theme.motion.durations.fast} ${theme.motion.easings.standard}`};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  input[type='checkbox'] {
    cursor: pointer;
  }

  span {
    font-size: ${({ theme }) => theme.typography.sizes.base};
    color: #fff;
    flex: 1;
  }

  span.id {
    flex: 0 0 60px;
    font-weight: bold;
  }

  span.title {
    flex: 2;
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    opacity: 0.9;
  }
`;

export const QuestionSelector = ({
  sageId,
  questionsIndex,
  selectedQuestionIds,
  onSelect
}) => {
  const toggleQuestion = (questionId) => {
    if (selectedQuestionIds.includes(questionId)) {
      onSelect(selectedQuestionIds.filter(id => id !== questionId));
    } else {
      onSelect([...selectedQuestionIds, questionId]);
    }
  };

  if (!questionsIndex || questionsIndex.length === 0) {
    return (
      <QuestionSelectorContainer>
        <p style={{ margin: 0, opacity: 0.7 }}>Aucune question pour ce sage.</p>
      </QuestionSelectorContainer>
    );
  }

  return (
    <QuestionSelectorContainer>
      {questionsIndex.map(question => (
        <QuestionItemLabel key={question.id}>
          <input
            type="checkbox"
            checked={selectedQuestionIds.includes(question.id)}
            onChange={() => toggleQuestion(question.id)}
          />
          <span className="id">{question.id}</span>
          <span className="title">{question.title}</span>
        </QuestionItemLabel>
      ))}
    </QuestionSelectorContainer>
  );
};
