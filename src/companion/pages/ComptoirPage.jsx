// src/companion/pages/ComptoirPage.jsx

import React, { useState, useEffect, useRef } from "react";
import styled, { useTheme } from "styled-components";
import Panel from "../../components/common/Panel/Panel";
import { SageSelector } from "../../components/rooms/Comptoir/widgets/SageSelector";
import { QuestionSelector } from "../../components/rooms/Comptoir/widgets/QuestionSelector";
import { QuestionsPanel } from "../../components/rooms/Comptoir/widgets/QuestionsPanel";
import { readNote } from "../../services/vaultApi";
import sagesConfig from "../../data/sagesConfig.json";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes["2xl"]};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
`;

/**
 * Page Comptoir - Interface mobile pour portail 8 Sages
 * @renders PageContainer
 * @renders PageTitle
 * @renders Panel
 * @renders SageSelector
 * @renders QuestionSelector
 * @renders QuestionsPanel
 */
const ComptoirPage = () => {
  const theme = useTheme();
  const questionsPanelRef = useRef(null);

  // State management
  const [activeSageId, setActiveSageId] = useState(() => {
    return localStorage.getItem("comptoir-active-sage") || "eleo";
  });

  const [questionsIndex, setQuestionsIndex] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const activeSage = sagesConfig.sages.find((s) => s.id === activeSageId);

  const handleSaveQuestion = async () => {
    if (!selectedQuestionIds[0] || !questionsPanelRef.current) return;
    setIsSaving(true);
    try {
      await questionsPanelRef.current.saveCurrentQuestion(
        selectedQuestionIds[0]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Persist sage selection
  useEffect(() => {
    localStorage.setItem("comptoir-active-sage", activeSageId);
  }, [activeSageId]);

  // Load questions index when sage changes
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const indexPath = `1-knowledge-base/index-sages/${activeSageId}-questions.md`;
        const content = await readNote(indexPath);

        const questions = parseQuestionsFromMarkdown(content);
        setQuestionsIndex(questions);
        setSelectedQuestionIds([]); // Reset selection on sage change
      } catch (error) {
        console.error("[ComptoirPage] Error loading questions:", error);
        setQuestionsIndex([]);
      }
    };

    if (activeSageId) {
      loadQuestions();
    }
  }, [activeSageId]);

  // Parse markdown index to extract questions with filepath from vault
  const parseQuestionsFromMarkdown = (content) => {
    const questions = [];

    // Use matchAll to capture each question block with its full content
    const questionRegex =
      /###\s+\[([A-Z0-9]+)\]\s+([^\n]+)\n([\s\S]*?)(?=###\s+\[|$)/g;

    let match;
    while ((match = questionRegex.exec(content)) !== null) {
      const questionId = match[1];
      const titleAndDescription = match[2];
      const sectionContent = match[3] || "";

      // Extract title (remove description after dash)
      const titleMatch = titleAndDescription.match(/^([^-]+)(?:\s*-\s*(.+))?$/);
      const title = titleMatch ? titleMatch[1].trim() : titleAndDescription;

      // Extract filepath from "- **Fichier** : `path/to/file.md`"
      const filepathMatch = sectionContent.match(
        /\-\s*\*\*Fichier\s*\*\*\s*:\s*`([^`]+)`/
      );
      const relativeFilepath = filepathMatch ? filepathMatch[1].trim() : null;

      // Prepend 1-knowledge-base/ if filepath is relative
      const filepath = relativeFilepath
        ? relativeFilepath.startsWith("1-knowledge-base/")
          ? relativeFilepath
          : `1-knowledge-base/${relativeFilepath}`
        : null;

      // Extract domaine from filepath
      let domaine =
        questionId.substring(0, questionId.search(/\d/)) || "unknown";
      if (filepath) {
        const domainMatch = filepath.match(/domaines-v4\/([^/]+)\//);
        if (domainMatch) {
          domaine = domainMatch[1];
        }
      }

      const question = {
        id: questionId,
        title: title.trim(),
        domaine: domaine,
        filepath: filepath,
      };

      questions.push(question);
    }

    return questions;
  };

  return (
    <PageContainer>
      <PageTitle>🎭 Comptoir</PageTitle>

      {/* Sage Selector */}
      <Panel
        title="Choisir un Sage"
        icon="🎭"
        texture="metal"
        accentColor={theme.colors.accents.warm}
        collapsible={true}
        collapsed={false}
      >
        <SageSelector
          activeSageId={activeSageId}
          onSelect={setActiveSageId}
        />
      </Panel>

      {/* Question Selector */}
      <Panel
        title="Questions"
        icon="❓"
        texture="metal"
        accentColor={theme.colors.secondary}
        collapsible={true}
        collapsed={false}
      >
        <QuestionSelector
          sageId={activeSageId}
          questionsIndex={questionsIndex}
          selectedQuestionIds={selectedQuestionIds}
          onSelect={setSelectedQuestionIds}
          sageColor={activeSage?.color}
        />
      </Panel>

      {/* Questions Panel */}
      <Panel
        title={`Questions - ${activeSage?.name}`}
        icon="📖"
        texture="wood"
        accentColor={activeSage?.color}
        collapsible={true}
        collapsed={false}
        contentType="markdown"
        onSave={handleSaveQuestion}
        isSaving={isSaving}
        showSaveButton={selectedQuestionIds.length > 0}
      >
        <QuestionsPanel
          ref={questionsPanelRef}
          sageId={activeSageId}
          questionIds={selectedQuestionIds}
          sageColor={activeSage?.color}
          sageIndex={questionsIndex}
        />
      </Panel>
    </PageContainer>
  );
};

export default ComptoirPage;
