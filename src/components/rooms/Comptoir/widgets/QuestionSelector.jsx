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

const QuestionItemLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: ${({ theme }) =>
    `all ${theme.motion.durations.fast} ${theme.motion.easings.standard}`};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  input[type="checkbox"] {
    cursor: pointer;
  }

  span {
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    color: #fff;
    flex: 1;
  }

  span.title {
    opacity: 0.9;
    color: ${({ $sageColor }) => $sageColor || '#fff'};
  }
`;

export const QuestionSelector = ({
  sageId,
  questionsIndex,
  selectedQuestionIds,
  onSelect,
  sageColor,
}) => {
  const toggleQuestion = (questionId) => {
    if (selectedQuestionIds.includes(questionId)) {
      onSelect(selectedQuestionIds.filter((id) => id !== questionId));
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
      {questionsIndex.map((question) => (
        <QuestionItemLabel key={question.id} $sageColor={sageColor}>
          <input
            type="checkbox"
            checked={selectedQuestionIds.includes(question.id)}
            onChange={() => toggleQuestion(question.id)}
          />
          {/* <span className="id">{question.id}</span> */}
          <span className="title">{question.title}</span>
        </QuestionItemLabel>
      ))}
    </QuestionSelectorContainer>
  );
};
