// src/components/common/MindLogToolbar/MindLogToolbar.jsx

import React from 'react';
import { useTheme } from 'styled-components';

/**
 * Toolbar for MindLog with view mode, edit, log and clear controls
 * @renders div
 * @renders button
 */
const MindLogToolbar = ({
  viewMode = 'compact',
  isEditing = false,
  logsCount = 0,
  onToggleView,
  onToggleEdit,
  onQuickLog,
  _onClearLogs,
  _showEditButton = true,
  _showClearButton = false
}) => {
  const theme = useTheme();

  const viewModeLabels = {
    compact: 'Vue compacte',
    markdown: 'Notes markdown',
    logs: 'Historique'
  };

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {/* Bouton 1: Edit/View - Toujours visible */}
      <button
        onClick={viewMode === 'markdown' ? onToggleEdit : () => {
          onToggleView(); // Aller en mode markdown
          if (viewMode !== 'markdown') {
            setTimeout(() => onToggleEdit?.(), 100); // Puis activer l'édition
          }
        }}
        style={{
          background: viewMode === 'markdown' && isEditing ? 'white' : '#F0F0F0',
          border: '1px solid currentColor',
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '12px',
          cursor: 'pointer',
          minWidth: '32px',
          height: '24px'
        }}
        title={viewMode === 'markdown'
          ? (isEditing ? 'Mode lecture' : 'Mode édition')
          : 'Éditer les notes'
        }
      >
        {viewMode === 'markdown' && isEditing ? '👁️' : '✏️'}
      </button>

      {/* Bouton 2: Log avec badge - Toujours visible */}
      <button
        onClick={onQuickLog}
        style={{
          background: theme.colors?.accents?.success || '#68752C',
          border: 'none',
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '12px',
          cursor: 'pointer',
          color: theme.colors?.text?.light || '#F7FAFC',
          minWidth: '32px',
          height: '24px',
          position: 'relative'
        }}
        title="Enregistrer un log"
      >
        📊
        {logsCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: theme.colors?.accents?.danger || '#8B3A3A',
            color: 'white',
            borderRadius: '50%',
            width: '14px',
            height: '14px',
            fontSize: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {logsCount > 9 ? '9+' : logsCount}
          </span>
        )}
      </button>

      {/* Bouton 3: Changement de vue - Toujours visible */}
      <button
        onClick={onToggleView}
        style={{
          background: '#F0F0F0',
          border: '1px solid currentColor',
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '12px',
          cursor: 'pointer',
          minWidth: '32px',
          height: '24px'
        }}
        title={`Changer de vue (actuel: ${viewModeLabels[viewMode]})`}
      >
        🔄
      </button>
    </div>
  );
};

export default MindLogToolbar;