// src/components/tower/TowerViewer/TowerViewer.jsx

import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { ViewerContainer } from './TowerViewer.styles';
import MarkdownEditor from '../../common/MarkdownEditor';
import MarkdownToolbar from '../../common/MarkdownToolbar';
import TimeTimer from '../../widgets/TimeTimer';
import IconButton from '../../common/IconButton/IconButton';
import useNotesStore from '../../../stores/useNotesStore';
import usePreferencesStore from '../../../stores/usePreferencesStore';

/**
 * TowerViewer: Viewer dynamique multi-contenus
 * Affiche: Notes Dev (Desktop/Companion), Timer, ou autre selon towerViewerContent
 * @renders ViewerContainer
 */
const TowerViewer = () => {
  const theme = useTheme();
  const { getSideTowerNote, updateSideTowerNote, getCompanionNote, updateCompanionNote } = useNotesStore();
  const {
    sideTowerNotesSource,
    toggleSideTowerNotesSource,
    towerViewerContent,
    setTowerViewerContent
  } = usePreferencesStore();

  const [isEditing, setIsEditing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);

  // === NOTES CONTENT ===
  const isSideTowerSource = sideTowerNotesSource === 'sidetower';
  const currentNote = isSideTowerSource ? getSideTowerNote() : getCompanionNote('devNote');
  const updateNote = isSideTowerSource
    ? updateSideTowerNote
    : (value) => updateCompanionNote('devNote', value);

  const accentColor = isSideTowerSource
    ? theme.colors.accents.neutral
    : theme.colors.accents.cold;

  // Gestion du zoom
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, -2));

  // Labels selon le contenu
  const getContentLabel = () => {
    switch (towerViewerContent) {
      case 'timer': return { emoji: '⏱️', label: 'Timer' };
      case 'notes': return {
        emoji: '💡',
        label: isSideTowerSource ? 'Notes Dev (Desktop)' : 'Notes Dev (Companion)'
      };
      default: return { emoji: '👁️', label: 'Viewer' };
    }
  };

  const { emoji, label } = getContentLabel();

  /**
   * === RENDER FUNCTIONS ===
   *
   * LAYOUT PATTERNS (pour futurs contenus):
   *
   * 1. PATTERN "CENTERED" (widget visuel, taille fixe)
   *    → Exemple: timer, horloge, graphique
   *    → Layout: flex + alignItems/justifyContent center
   *    → Le composant a une taille max définie (ex: maxSize={250})
   *    → Résultat: widget centré avec espace vide autour
   *
   * 2. PATTERN "FULL SPACE" (contenu texte/liste)
   *    → Exemple: notes, calendrier, liste
   *    → Layout: conteneur enfant avec flex: 1
   *    → Le composant utilise height="100%" pour remplir
   *    → Résultat: contenu remplit tout l'espace disponible
   */
  const renderContent = () => {
    switch (towerViewerContent) {
      /**
       * PATTERN "CENTERED"
       * Timer centré avec taille fixe (maxSize: 250px)
       * Le wrapper utilise flex center pour centrer le widget
       */
      case 'timer':
        return (
          <div style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <TimeTimer maxSize={250} colorSelect={false} />
          </div>
        );

      /**
       * PATTERN "FULL SPACE"
       * Notes utilisent tout l'espace disponible
       * Le conteneur enfant (ligne 119) a flex: 1 pour remplir la hauteur
       * MarkdownEditor a height="100%" pour s'adapter
       */
      case 'notes':
        return (
          <>
            {/* Header Notes avec toolbar */}
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
                <IconButton
                  icon={isSideTowerSource ? '🖥️' : '📱'}
                  onClick={toggleSideTowerNotesSource}
                  variant="ghost"
                  size="small"
                  title={`Notes Dev ${isSideTowerSource ? 'Desktop' : 'Companion'} - Cliquer pour basculer`}
                />
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

            {/* MarkdownEditor - flex: 1 pour remplir l'espace */}
            <div style={{
              flex: 1,
              overflow: 'hidden',
              minHeight: 0
            }}>
              <MarkdownEditor
                value={currentNote}
                onChange={updateNote}
                placeholder={isSideTowerSource
                  ? "Notes Dev (Desktop)..."
                  : "Notes Dev (Companion)..."
                }
                height="100%"
                compact={true}
                variant="embedded"
                readOnly={!isEditing}
                zoomLevel={zoomLevel}
                accentColor={accentColor}
              />
            </div>
          </>
        );

      default:
        return (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.text.muted
          }}>
            <p>Aucun contenu à afficher</p>
          </div>
        );
    }
  };

  return (
    <ViewerContainer>
      {/* Header pour contenus autres que Notes et Timer */}
      {towerViewerContent !== 'notes' && towerViewerContent !== 'timer' && (
        <div style={{
          padding: '8px 12px',
          background: theme.colors.accents.neutral,
          color: 'white',
          borderRadius: '6px 6px 0 0',
          marginBottom: '8px',
          fontSize: '11px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          <span>{emoji} {label}</span>
        </div>
      )}

      {/* Contenu dynamique */}
      {renderContent()}
    </ViewerContainer>
  );
};

export default TowerViewer;
