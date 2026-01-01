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
import { metalBg } from "../../../styles/mixins";

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

  const activeSage = sagesConfig.sages.find((s) => s.id === activeSageId);

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

    // Split by heading to process each question block
    const sections = content.split(/###\s+\[([A-Z0-9]+)\]\s+(.+?)(?=###|\Z)/gs);

    // sections will be: [content before first heading, id1, title1, section1_content, id2, title2, section2_content, ...]
    for (let i = 1; i < sections.length; i += 3) {
      const questionId = sections[i];
      const titleAndDescription = sections[i + 1];
      const sectionContent = sections[i + 2] || "";

      // Extract title (remove description after dash)
      const titleMatch = titleAndDescription.match(/^([^-]+)(?:\s*-\s*(.+))?$/);
      const title = titleMatch ? titleMatch[1].trim() : titleAndDescription;

      // Extract filepath from "- **Fichier** : `path/to/file.md`"
      const filepathMatch = sectionContent.match(
        /\-\s*\*\*Fichier\*\*\s*:\s*`([^`]+)`/
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

      // Debug log
      if (!filepath) {
        console.warn(
          `[ComptoirRoom] No filepath extracted for ${questionId}. Section content: `,
          sectionContent.substring(0, 200)
        );
      }

      questions.push(question);
    }

    console.log(`[ComptoirRoom] Parsed ${questions.length} questions from index`);
    console.table(
      questions.map((q) => ({
        id: q.id,
        title: q.title.substring(0, 30),
        domaine: q.domaine,
        hasFilepath: !!q.filepath,
        filepath: q.filepath?.substring(0, 60),
      }))
    );

    return questions;
  };

  return (
    <BaseRoom roomType="comptoir" layoutType="grid">
      <PanelGrid columns={12} rows={8}>
        {/* Handoff Creator - placeholder for future M3 integration */}
        <Panel
          gridColumn="1 / 4"
          gridRow="3 / 9"
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
        </Panel>

        {/* Sage Selector */}
        <Panel
          gridColumn="1 / 13"
          gridRow="1 / 3"
          title="Choisir un Sage"
          icon="🎭"
          texture="parchment"
          accentColor={metalBg}
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
          gridColumn="4 / 13"
          gridRow="3 / 5"
          title="Questions"
          icon="❓"
          texture="parchment"
          accentColor={activeSage?.color}
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
          />
        </Panel>

        {/* Questions Panel */}
        <Panel
          gridColumn="4 / 13"
          gridRow="5 / 9"
          title={`Questions - ${activeSage?.name}`}
          icon="📖"
          texture="parchment"
          accentColor={activeSage?.color}
          collapsible={true}
          collapsed={
            getPanelState("comptoir", "questions-panel")?.collapsed ?? false
          }
          onToggleCollapse={(collapsed) =>
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
