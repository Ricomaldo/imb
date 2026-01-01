import React, { useState } from 'react';
import styled from 'styled-components';
import sagesIndexData from '../../../../data/sagesIndex.json';

const KnowledgeContainer = styled.div`
  margin: 15px 0;
  padding: 15px;
  border-left: 3px solid ${props => props.color};
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const KnowledgeTitle = styled.p`
  margin: 0 0 10px 0;
  font-size: 0.9em;
  font-weight: 600;
  opacity: 0.9;
`;

const QuestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const QuestionItem = styled.button`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid ${props => props.color}33;
  border-radius: 4px;
  padding: 8px 12px;
  color: #fff;
  cursor: pointer;
  text-align: left;
  font-size: 0.85em;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
    border-color: ${props => props.color}66;
  }

  strong {
    color: ${props => props.color};
    margin-right: 8px;
  }
`;

const QuestionDetail = styled.div`
  margin: 10px 0 0 0;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-left: 3px solid ${props => props.color};
  border-radius: 4px;
  font-size: 0.8em;
  opacity: 0.8;
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
      <KnowledgeTitle>📚 Questions liées</KnowledgeTitle>
      <QuestionsList>
        {questions.map(question => (
          <div key={question.id}>
            <QuestionItem
              color={color}
              onClick={() => toggleQuestion(question.id)}
            >
              <strong>{question.id}</strong>
              {question.title}
            </QuestionItem>
            {expandedQuestionId === question.id && (
              <QuestionDetail color={color}>
                Domaine: <strong>{question.domain}</strong>
              </QuestionDetail>
            )}
          </div>
        ))}
      </QuestionsList>
    </KnowledgeContainer>
  );
};
