// src/components/tower/SideTowerNotes/SideTowerNotes.jsx

import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { NoteContainer } from './SideTowerNotes.styles';
import MarkdownEditor from '../../common/MarkdownEditor';
import MarkdownToolbar from '../../common/MarkdownToolbar';
import useNotesStore from '../../../stores/useNotesStore';
import usePreferencesStore from '../../../stores/usePreferencesStore';

/**
 * Side tower notes component with expandable markdown editor
 * Supports toggling between SideTower notes and Companion Dev notes
 * @renders NoteContainer
 * @renders div
 * @renders span
 * @renders MarkdownToolbar
 * @renders MarkdownEditor
 */
const SideTowerNotes = () => {
  const theme = useTheme();
  const { getSideTowerNote, updateSideTowerNote, getCompanionNote, updateCompanionNote } = useNotesStore();
  const { sideTowerNotesSource, toggleSideTowerNotesSource } = usePreferencesStore();
  const [isEditing, setIsEditing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Déterminer quelle source afficher
  const isSideTowerSource = sideTowerNotesSource === 'sidetower';
  const currentNote = isSideTowerSource ? getSideTowerNote() : getCompanionNote('devNote');
  const updateNote = isSideTowerSource
    ? updateSideTowerNote
    : (value) => updateCompanionNote('devNote', value);

  // Couleur d'accent pour SideTowerNotes
  const accentColor = isSideTowerSource
    ? theme.colors.accents.neutral
    : theme.colors.accents.cold;

  // Gestion du zoom (même logique que MarkdownPanel)
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, -2));
  };

  // Labels et emojis selon la source
  const sourceLabel = isSideTowerSource ? 'SideTower' : 'Dev (Companion)';
  const sourceEmoji = isSideTowerSource ? '📝' : '💡';

  if (!isExpanded) {
    return (
      <NoteContainer style={{
        padding: '12px',
        cursor: 'pointer',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }} onClick={() => setIsExpanded(true)}>
        <span>{sourceEmoji} Notes {sourceLabel}</span>
        <span style={{ fontSize: '10px', opacity: 0.7 }}>➡️</span>
      </NoteContainer>
    );
  }

  return (
    <NoteContainer>
      {/* Header avec toolbar et toggle source */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: accentColor,
        color: 'white',
        borderRadius: '6px 6px 0 0',
        marginBottom: '8px',
        fontSize: '11px',
        fontWeight: 'bold',
        gap: '8px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1
        }}>
          <span>{sourceEmoji} {sourceLabel}</span>
          <button
            onClick={toggleSideTowerNotesSource}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 'normal',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            title={`Basculer vers ${isSideTowerSource ? 'Dev (Companion)' : 'SideTower'}`}
          >
            ⇄
          </button>
        </div>
        <MarkdownToolbar
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          showEditButton={true}
        />
      </div>

      {/* MarkdownEditor sans header */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        minHeight: 0 /* Permet au flex child de rétrécir */
      }}>
        <MarkdownEditor
          value={currentNote}
          onChange={updateNote}
          placeholder={isSideTowerSource
            ? "Notes SideTower (Desktop)..."
            : "Notes Dev (Companion mobile)..."
          }
          height="100%"
          compact={true}
          variant="embedded"
          readOnly={!isEditing}
          zoomLevel={zoomLevel}
          accentColor={accentColor}
        />
      </div>

      {/* Bouton fermer */}
      <div style={{
        padding: '8px',
        textAlign: 'center',
        borderTop: '1px solid #ccc',
        cursor: 'pointer',
        fontSize: '10px'
      }} onClick={() => setIsExpanded(false)}>
        ⬇️ Fermer
      </div>
    </NoteContainer>
  );
};

export default SideTowerNotes;