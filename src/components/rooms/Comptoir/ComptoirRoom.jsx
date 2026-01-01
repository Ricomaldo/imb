// src/components/rooms/Comptoir/ComptoirRoom.jsx

import React, { useState, useEffect } from "react";
import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import { SageSelector } from "./widgets/SageSelector";
import { QuestionSelector } from "./widgets/QuestionSelector";
import { QuestionsPanel } from "./widgets/QuestionsPanel";
import { readNote } from "../../../services/vaultApi";
import sagesConfig from "../../../data/sagesConfig.json";
import usePreferencesStore from "../../../stores/usePreferencesStore";

/**
 * Comptoir room component for sage portal and knowledge
 * @renders BaseRoom
 * @renders PanelGrid (12x8)
 * @renders Sage Selector + Question Selector + Questions Panel
 */
const ComptoirRoom = () => {
  const theme = useTheme();
  const { getPanelState, updatePanelState } = usePreferencesStore();

  // State management
  const [activeSageId, setActiveSageId] = useState(() => {
    return localStorage.getItem("comptoir-active-sage") || "eleonore";
  });

  const [questionsIndex, setQuestionsIndex] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  const activeSage = sagesConfig.sages.find(s => s.id === activeSageId);

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

  // Parse markdown index to extract questions
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
        domaine: questionId.substring(0, questionId.search(/\d/)) || "unknown"
      });
    }

    return questions;
  };

  return (
    <BaseRoom roomType="comptoir" layoutType="grid">
      <PanelGrid columns={12} rows={8}>
        {/* Handoff Creator - placeholder for future M3 integration */}
        <Panel
          gridColumn="1 / 4"
          gridRow="1 / 4"
          title="Handoff"
          icon="✉️"
          texture="parchment"
          accentColor={theme.colors.accents.warm}
          collapsible={true}
          collapsed={getPanelState("comptoir", "handoff")?.collapsed ?? false}
          onToggleCollapse={collapsed =>
            updatePanelState("comptoir", "handoff", { collapsed })
          }
        >
          <div style={{ padding: "12px", opacity: 0.7 }}>
            Créer un handoff vers les sages
          </div>
        </Panel>

        {/* Sage Selector */}
        <Panel
          gridColumn="4 / 13"
          gridRow="1 / 2"
          title="Choisir un Sage"
          icon="🎭"
          texture="parchment"
          accentColor={theme.colors.accents.warm}
          collapsible={true}
          collapsed={getPanelState("comptoir", "sage-selector")?.collapsed ?? false}
          onToggleCollapse={collapsed =>
            updatePanelState("comptoir", "sage-selector", { collapsed })
          }
        >
          <SageSelector activeSageId={activeSageId} onSelect={setActiveSageId} />
        </Panel>

        {/* Question Selector */}
        <Panel
          gridColumn="4 / 13"
          gridRow="2 / 3"
          title="Questions"
          icon="❓"
          texture="parchment"
          accentColor={activeSage?.color}
          collapsible={true}
          collapsed={getPanelState("comptoir", "question-selector")?.collapsed ?? false}
          onToggleCollapse={collapsed =>
            updatePanelState("comptoir", "question-selector", { collapsed })
          }
        >
          <QuestionSelector
            sageId={activeSageId}
            questionsIndex={questionsIndex}
            selectedQuestionIds={selectedQuestionIds}
            onSelect={setSelectedQuestionIds}
          />
        </Panel>

        {/* Questions Panel */}
        <Panel
          gridColumn="4 / 13"
          gridRow="3 / 8"
          title={`Questions - ${activeSage?.name}`}
          icon="📖"
          texture="parchment"
          accentColor={activeSage?.color}
          collapsible={true}
          collapsed={getPanelState("comptoir", "questions-panel")?.collapsed ?? false}
          onToggleCollapse={collapsed =>
            updatePanelState("comptoir", "questions-panel", { collapsed })
          }
        >
          <QuestionsPanel
            sageId={activeSageId}
            questionIds={selectedQuestionIds}
            sageColor={activeSage?.color}
            sageIndex={questionsIndex}
          />
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default ComptoirRoom;
