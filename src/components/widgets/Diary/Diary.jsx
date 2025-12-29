// src/components/widgets/Diary/Diary.jsx

import React, { useEffect } from 'react';
import MarkdownEditor from '../../common/MarkdownEditor';
import useDiaryStore from '../../../stores/useDiaryStore';
import { usePanelContext } from '../../common/Panel/PanelContext';

/**
 * Daily Diary widget with Markdown support
 * @renders MarkdownEditor
 */
const Diary = () => {
  const {
    getDailyEntry,
    updateDailyEntry,
    archiveMonthlyEntries
  } = useDiaryStore();

  // Détecter le mode Focus pour adapter les styles
  const { isExpanded } = usePanelContext();

  // Obtenir la date du jour au format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Archivage automatique au montage du composant
  useEffect(() => {
    // Archiver toutes les entrées des jours précédents (garde uniquement aujourd'hui)
    archiveMonthlyEntries();
  }, [today]); // Se déclenche quand le jour change

  // Récupérer l'entrée du jour
  const todayEntry = getDailyEntry(today);

  const handleContentChange = (content) => {
    updateDailyEntry(today, content);
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: isExpanded ? '0' : '12px'
    }}>
      {/* Masquer le header en mode Focus (le Panel affiche déjà le titre) */}
      {!isExpanded && (
        <div style={{
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#8b7355',
          textAlign: 'center'
        }}>
          Journal du {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      )}

      <div style={{
        flex: 1,
        overflow: isExpanded ? 'hidden' : 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <MarkdownEditor
          value={todayEntry}
          onChange={handleContentChange}
          placeholder="Écrivez votre journal quotidien..."
          variant="embedded"
          showPreview={true}
          height="100%"
        />
      </div>
    </div>
  );
};

export default Diary;