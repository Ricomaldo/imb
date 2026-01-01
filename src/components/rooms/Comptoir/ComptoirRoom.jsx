// src/components/rooms/Comptoir/ComptoirRoom.jsx

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import { SageSelector } from "./widgets/SageSelector";
import { QuestionSelector } from "./widgets/QuestionSelector";
import { QuestionsPanel } from "./widgets/QuestionsPanel";
import HandoffCreator from "./widgets/HandoffCreator";
import { readNote } from "../../../services/vaultApi";
import sagesConfig from "../../../data/sagesConfig.json";
import usePreferencesStore from "../../../stores/usePreferencesStore";
import { woodBg, metalBg } from "../../../styles/mixins";

/**
 * Comptoir room component for sage portal and knowledge
 * @renders BaseRoom
 * @renders PanelGrid (12x8)
 * @renders Sage Selector + Question Selector + Questions Panel
 */
const ComptoirRoom = () => {
  const theme = useTheme();
  const { getPanelState, updatePanelState } = usePreferencesStore();
  const questionsPanelRef = useRef(null);

  // State management
  const [activeSageId, setActiveSageId] = useState(() => {
    return localStorage.getItem("comptoir-active-sage") || "eleo";
  });

  const [questionsIndex, setQuestionsIndex] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showHandoffModal, setShowHandoffModal] = useState(false);

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
        console.error("[Comptoir] Error loading questions:", error);
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
    // Pattern: ### [ID] Title - Description
    // Then capture everything until the next ### or end of file
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
      // Pattern: "- **Fichier** : `path`" or "- **Fichier :** `path`"
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

      // Extract domaine from filepath (e.g., "accompagnement-ia" from "...domaines-v4/accompagnement-ia/...")
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
    <BaseRoom roomType="comptoir" layoutType="grid">
      <PanelGrid columns={12} rows={8}>
        {/* Handoff Creator - placeholder for future M3 integration */}
        {/* <Panel
          gridColumn="1 / 5"
          gridRow="8 / 9"
          title="Handoff"
          icon="✉️"
          texture="parchment"
          accentColor={theme.colors.accents.warm}
          collapsible={true}
          collapsed={getPanelState("comptoir", "handoff")?.collapsed ?? false}
          onToggleCollapse={(collapsed) =>
            updatePanelState("comptoir", "handoff", { collapsed })
          }
        >
          <div style={{ padding: "12px", opacity: 0.7 }}>
            Créer un handoff vers les sages
          </div>
        </Panel> */}

        {/* Sage Selector */}
        <Panel
          gridColumn="1 / 13"
          gridRow="1 / 3"
          title="Choisir un Sage"
          icon="🎭"
          texture="metal"
          accentColor={woodBg}
          collapsible={true}
          collapsed={
            getPanelState("comptoir", "sage-selector")?.collapsed ?? false
          }
          onToggleCollapse={(collapsed) =>
            updatePanelState("comptoir", "sage-selector", { collapsed })
          }
        >
          <SageSelector
            activeSageId={activeSageId}
            onSelect={setActiveSageId}
          />
        </Panel>

        {/* Question Selector */}
        <Panel
          gridColumn="1 / 5"
          gridRow="3 / 8"
          title="Questions"
          icon="❓"
          texture="metal"
          accentColor={theme.colors.secondary}
          collapsible={true}
          collapsed={
            getPanelState("comptoir", "question-selector")?.collapsed ?? false
          }
          onToggleCollapse={(collapsed) =>
            updatePanelState("comptoir", "question-selector", { collapsed })
          }
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
          gridColumn="5 / 13"
          gridRow="3 / 9"
          title={`Questions - ${activeSage?.name}`}
          icon="📖"
          texture="wood"
          accentColor={activeSage?.color}
          collapsible={true}
          collapsed={
            getPanelState("comptoir", "questions-panel")?.collapsed ?? false
          }
          onToggleCollapse={(collapsed) =>
            updatePanelState("comptoir", "questions-panel", { collapsed })
          }
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

        {/* Handoff Button */}
        <Panel
          gridColumn="1 / 5"
          gridRow="8 / 9"
          texture="parchment"
          accentColor={theme.colors.accents.warm}
          onClick={() => setShowHandoffModal(true)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              padding: "8px",
              fontWeight: "bold",
            }}
          >
            ✉️ Créer Handoff
          </div>
        </Panel>
      </PanelGrid>

      {/* Handoff Modal */}
      {showHandoffModal &&
        createPortal(
          <HandoffCreator
            activeSageId={activeSageId}
            onClose={() => setShowHandoffModal(false)}
          />,
          document.body
        )}
    </BaseRoom>
  );
};

export default ComptoirRoom;
