import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { readNote } from '../../../../services/vaultApi';

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
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load questions from vault dynamically
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Read sage index file from vault
        const indexPath = `1-knowledge-base/index-sages/${sageId}-questions.md`;
        const content = await readNote(indexPath);

        // Parse questions from markdown
        const questions = parseQuestionsFromMarkdown(content);
        setQuestions(questions || []);
      } catch (err) {
        console.error(`[SagesKnowledge] Error loading questions for ${sageId}:`, err);
        setError(err.message);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    if (sageId) {
      loadQuestions();
    }
  }, [sageId]);

  /**
   * Parse markdown file and extract questions
   * Format: ### [QID] Title - Description
   */
  const parseQuestionsFromMarkdown = (content) => {
    const questions = [];
    const questionRegex = /###\s+\[([A-Z0-9]+)\]\s+(.+?)(?:\n|$)/g;

    let match;
    while ((match = questionRegex.exec(content)) !== null) {
      const questionId = match[1];
      const titleAndDescription = match[2];

      // Parse title (remove description if present)
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

  if (loading) {
    return (
      <KnowledgeContainer color={color}>
        <KnowledgeTitle>📚 Questions liées...</KnowledgeTitle>
      </KnowledgeContainer>
    );
  }

  if (error) {
    return (
      <KnowledgeContainer color={color}>
        <KnowledgeTitle>📚 Questions liées</KnowledgeTitle>
        <div style={{ fontSize: '0.85em', color: '#ff9999', opacity: 0.8 }}>
          ⚠️ Erreur chargement: {error}
        </div>
      </KnowledgeContainer>
    );
  }

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
      <KnowledgeTitle>📚 Questions liées ({questions.length})</KnowledgeTitle>
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
                <div>
                  <strong>Domaine:</strong> {question.domain}
                </div>
                <div style={{ fontSize: '0.75em', marginTop: '4px', opacity: 0.8 }}>
                  <strong>Status:</strong> {question.status}
                </div>
              </QuestionDetail>
            )}
          </div>
        ))}
      </QuestionsList>
    </KnowledgeContainer>
  );
};
