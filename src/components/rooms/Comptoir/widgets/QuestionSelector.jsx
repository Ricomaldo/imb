import React from "react";
import styled from "styled-components";

const QuestionSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  box-sizing: border-box;
  min-height: 200px;
  overflow-y: auto;
`;

const QuestionItemLabel = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  border-left: 2px solid transparent;
  transition: ${({ theme }) =>
    `all ${theme.motion.durations.fast} ${theme.motion.easings.standard}`};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  ${({ $isSelected, $sageColor }) =>
    $isSelected &&
    `
    border-left-color: ${$sageColor || "#fff"};
    background: rgba(255, 255, 255, 0.08);
  `}

  span.title {
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    color: ${({ $sageColor }) => "#222"};
    opacity: 0.9;
  }
`;

export const QuestionSelector = ({
  sageId,
  questionsIndex,
  selectedQuestionIds,
  onSelect,
  sageColor,
}) => {
  const selectQuestion = (questionId) => {
    onSelect([questionId]);
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
      {questionsIndex.map((question) => (
        <QuestionItemLabel
          key={question.id}
          $sageColor={sageColor}
          $isSelected={selectedQuestionIds.includes(question.id)}
          onClick={() => selectQuestion(question.id)}
        >
          <span className="title">{question.title}</span>
        </QuestionItemLabel>
      ))}
    </QuestionSelectorContainer>
  );
};
