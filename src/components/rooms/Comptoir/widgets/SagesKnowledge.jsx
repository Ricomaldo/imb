import React, { useState } from 'react';
import styled from 'styled-components';
import sagesIndexData from '../../../../data/sagesIndex.json';

const KnowledgeContainer = styled.div`
  margin: 15px 0;
  padding: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0.1) 100%);
  border: 1px solid ${props => props.color}44;
  border-left: 4px solid ${props => props.color};
  border-radius: 6px;
  backdrop-filter: blur(4px);

  @media (max-width: 640px) {
    padding: 12px;
    margin: 12px 0;
    border-left-width: 3px;
  }
`;

const KnowledgeTitle = styled.p`
  margin: 0 0 12px 0;
  font-size: 0.95em;
  font-weight: 600;
  opacity: 0.95;
  color: #f5f5f5;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 640px) {
    font-size: 0.9em;
    margin-bottom: 10px;
  }
`;

const QuestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 640px) {
    gap: 6px;
  }
`;

const QuestionItem = styled.button`
  background: ${props => props.color}10;
  border: 1px solid ${props => props.color}55;
  border-radius: 5px;
  padding: 10px 12px;
  color: #fff;
  cursor: pointer;
  text-align: left;
  font-size: 0.9em;
  transition: all 0.2s;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: ${props => props.color}25;
    border-color: ${props => props.color}88;
    transform: translateX(2px);
  }

  &:active {
    transform: translateX(0);
  }

  strong {
    color: ${props => props.color};
    min-width: fit-content;
    font-weight: 600;
    font-size: 0.85em;
    background: ${props => props.color}30;
    padding: 3px 6px;
    border-radius: 3px;
  }

  @media (max-width: 640px) {
    padding: 8px 10px;
    font-size: 0.85em;
    gap: 8px;

    strong {
      font-size: 0.75em;
      padding: 2px 4px;
    }
  }
`;

const QuestionDetail = styled.div`
  margin: 6px 0 0 0;
  padding: 10px 12px;
  background: ${props => props.color}15;
  border-left: 3px solid ${props => props.color};
  border-radius: 4px;
  font-size: 0.85em;
  opacity: 0.9;
  margin-left: 0;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 0.9;
      transform: translateY(0);
    }
  }

  strong {
    color: ${props => props.color};
    font-weight: 600;
  }

  @media (max-width: 640px) {
    padding: 8px 10px;
    font-size: 0.8em;
  }
`;

export const SagesKnowledge = ({ sageId, color }) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  const sageData = sagesIndexData[sageId];
  const questions = sageData?.questions || [];

  if (questions.length === 0) {
    return null;
  }

  const toggleQuestion = (questionId) => {
    setExpandedQuestionId(
      expandedQuestionId === questionId ? null : questionId
    );
  };

  return (
    <KnowledgeContainer color={color}>
      <KnowledgeTitle>📖 Champ d'exploration</KnowledgeTitle>
      <QuestionsList>
        {questions.map(question => (
          <div key={question.id}>
            <QuestionItem
              color={color}
              onClick={() => toggleQuestion(question.id)}
            >
              <strong>{question.id}</strong>
              <span>{question.title}</span>
            </QuestionItem>
            {expandedQuestionId === question.id && (
              <QuestionDetail color={color}>
                <strong>Domaine:</strong> {question.domain}
              </QuestionDetail>
            )}
          </div>
        ))}
      </QuestionsList>
    </KnowledgeContainer>
  );
};
