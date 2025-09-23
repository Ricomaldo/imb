// src/components/widgets/MindLog/MindLogCompact.jsx
// Version compacte du MindLog pour espaces restreints (1x2 grid)

import React, { useState, useCallback, useEffect } from "react";
import { useTheme } from 'styled-components';
import useDiaryStore from '../../../stores/useDiaryStore';
import { useProjectData } from '../../../stores/useProjectDataStore';
import useProjectMetaStore from '../../../stores/useProjectMetaStore';

const MindLogCompact = ({
  context = 'diary', // 'diary' ou 'project'
  onLogSave = null,
  onMount = null
}) => {
  const theme = useTheme();

  // Stores selon le contexte
  const { selectedProject } = useProjectMetaStore();
  const projectData = useProjectData(selectedProject);
  const diaryStore = useDiaryStore();

  // États locaux
  const [viewMode, setViewMode] = useState('compact'); // 'compact', 'markdown', 'logs'
  const [isEditing, setIsEditing] = useState(false); // Mode édition pour markdown
  const [currentMood, setCurrentMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [focus, setFocus] = useState(3);
  const [notes, setNotes] = useState("");
  const [markdownText, setMarkdownText] = useState("");
  const [localLogs, setLocalLogs] = useState([]);
  const [showHidden, setShowHidden] = useState(false); // Afficher/masquer les entrées cachées

  // Emojis simplifiés (5 au lieu de 10)
  const moodEmojis = ["😫", "😐", "🙂", "😊", "🔥"];

  // Initialisation selon le contexte
  useEffect(() => {
    if (context === 'diary') {
      const { current, markdownNotes } = diaryStore.mindlog;
      setCurrentMood(current.mood);
      setEnergy(current.energy);
      setFocus(current.focus);
      setNotes(current.note);
      // Utiliser getVisibleLogs pour ne voir que les entrées non-cachées
      const visibleLogs = showHidden ? diaryStore.getAllLogs() : diaryStore.getVisibleLogs();
      setLocalLogs(visibleLogs || []);
      setMarkdownText(markdownNotes || '');
    } else if (context === 'project' && projectData) {
      const mindlogState = projectData.getModuleState('mindlog') || {};
      if (mindlogState.data) {
        setCurrentMood(mindlogState.data.mood || 3);
        setEnergy(mindlogState.data.energy || 3);
        setFocus(mindlogState.data.focus || 3);
        setNotes(mindlogState.data.note || '');
        setLocalLogs(mindlogState.data.logs || []);
        setMarkdownText(mindlogState.data.markdownNotes || '');
      }
    }
  }, [context, showHidden, diaryStore]); // Dépendances minimales pour éviter les re-renders

  // Génération d'un log
  const generateLog = useCallback(() => {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      mood: currentMood,
      energy,
      focus,
      notes: notes.trim(),
      emoji: moodEmojis[currentMood - 1],
      type: "compact"
    };
  }, [currentMood, energy, focus, notes]);

  // Sauvegarde d'un log
  const saveLog = useCallback((log) => {
    const newLogs = [...localLogs, log].slice(-20);
    setLocalLogs(newLogs);

    if (context === 'diary') {
      diaryStore.addMindLogEntry(log);
      diaryStore.updateMindLogCurrent({
        mood: currentMood,
        energy,
        focus,
        note: notes
      });
    } else if (context === 'project' && projectData) {
      projectData.updateModuleState('mindlog', {
        data: {
          mood: currentMood,
          energy,
          focus,
          note: notes,
          logs: newLogs,
          markdownNotes: markdownText
        }
      });
    }
  }, [localLogs, context, currentMood, energy, focus, notes, markdownText, diaryStore, projectData]);

  // Handler pour log rapide
  const handleQuickLog = useCallback(() => {
    const log = generateLog();
    saveLog(log);
    onLogSave?.(log);
    setNotes(""); // Reset des notes
    setViewMode('logs'); // Basculer vers la vue logs
  }, [generateLog, saveLog, onLogSave]);

  // Handler pour changer de vue
  const handleToggleView = useCallback(() => {
    const modes = ['compact', 'markdown', 'logs'];
    const currentIndex = modes.indexOf(viewMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setViewMode(nextMode);
    // Reset editing mode when leaving markdown view
    if (nextMode !== 'markdown') {
      setIsEditing(false);
    }
  }, [viewMode]);

  // Handler pour toggle edit/view dans markdown
  const handleToggleEdit = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  // Handler pour cacher/montrer un log
  const handleToggleHideLog = useCallback((logId) => {
    if (context === 'diary') {
      diaryStore.toggleLogVisibility(logId);
      // Rafraîchir les logs locaux
      const logs = showHidden ? diaryStore.getAllLogs() : diaryStore.getVisibleLogs();
      setLocalLogs(logs);
    }
  }, [context, diaryStore, showHidden]);

  // Handler pour basculer l'affichage des cachés
  const handleToggleShowHidden = useCallback(() => {
    setShowHidden(!showHidden);
  }, [showHidden]);

  // Handler pour supprimer un log (non utilisé mais gardé pour compatibilité)
  const handleDeleteLog = useCallback((index) => {
    const newLogs = localLogs.filter((_, i) => i !== index);
    setLocalLogs(newLogs);

    if (context === 'diary') {
      const state = diaryStore.getState();
      diaryStore.setState({
        ...state,
        mindlog: {
          ...state.mindlog,
          logs: newLogs
        }
      });
    } else if (context === 'project' && projectData) {
      const currentState = projectData.getModuleState('mindlog') || {};
      projectData.updateModuleState('mindlog', {
        ...currentState,
        data: {
          ...currentState.data,
          logs: newLogs
        }
      });
    }
  }, [localLogs, context, diaryStore, projectData]);

  // Handler pour effacer tous les logs
  const handleClearLogs = useCallback(() => {
    setLocalLogs([]);
    if (context === 'diary') {
      diaryStore.clearMindLogHistory();
    } else if (context === 'project' && projectData) {
      const currentState = projectData.getModuleState('mindlog') || {};
      projectData.updateModuleState('mindlog', {
        ...currentState,
        data: {
          ...currentState.data,
          logs: []
        }
      });
    }
  }, [context, diaryStore, projectData]);

  // Sauvegarde du markdown
  const saveMarkdown = useCallback((text) => {
    setMarkdownText(text);
    if (context === 'diary') {
      diaryStore.updateMarkdownNotes(text);
    } else if (context === 'project' && projectData) {
      const currentState = projectData.getModuleState('mindlog') || {};
      projectData.updateModuleState('mindlog', {
        ...currentState,
        data: {
          ...currentState.data,
          markdownNotes: text
        }
      });
    }
  }, [context, diaryStore, projectData]);

  // Notifier le parent des handlers disponibles
  useEffect(() => {
    if (onMount) {
      onMount({
        handleQuickLog,
        handleToggleView,
        handleToggleEdit,
        handleClearLogs,
        viewMode,
        isEditing,
        logsCount: localLogs.length,
        handleToggleShowHidden,
        showHidden
      });
    }
  }, [onMount, handleQuickLog, handleToggleView, handleToggleEdit, handleClearLogs, handleToggleShowHidden, viewMode, isEditing, localLogs.length, showHidden]);

  // Render slider
  const renderSlider = (value, setValue, icon, color) => (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "6px"
    }}>
      <span style={{ fontSize: "14px", minWidth: "20px" }}>{icon}</span>
      <div style={{
        flex: 1,
        position: "relative",
        height: "20px"
      }}>
        <div style={{
          position: "absolute",
          width: "100%",
          height: "6px",
          top: "7px",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "3px",
          border: "1px solid rgba(255,255,255,0.2)"
        }} />
        <div style={{
          position: "absolute",
          width: `${(value / 5) * 100}%`,
          height: "6px",
          top: "7px",
          backgroundColor: color,
          borderRadius: "3px",
          boxShadow: value > 3 ? `0 0 6px ${color}40` : 'none',
          transition: "all 0.3s ease"
        }} />
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{
            position: "absolute",
            width: "100%",
            height: "20px",
            top: 0,
            opacity: 0,
            cursor: "pointer"
          }}
        />
        <div style={{
          position: "absolute",
          left: `calc(${((value - 1) / 4) * 100}% - 8px)`,
          top: "2px",
          width: "16px",
          height: "16px",
          backgroundColor: color,
          border: "2px solid rgba(255,255,255,0.9)",
          borderRadius: "50%",
          boxShadow: `0 2px 4px rgba(0,0,0,0.2), 0 0 8px ${color}40`,
          transition: "all 0.3s ease",
          pointerEvents: "none"
        }} />
      </div>
      <span style={{
        fontSize: "11px",
        minWidth: "16px",
        textAlign: "right",
        color: color,
        fontWeight: "bold"
      }}>{value}</span>
    </div>
  );

  // Vue compacte
  const renderCompactView = () => (
    <>
      {/* Header avec emoji actuel */}
      <div style={{
        textAlign: "center",
        marginBottom: "6px"
      }}>
        <div style={{
          fontSize: "32px",
          filter: currentMood >= 4 ? "drop-shadow(0 0 8px rgba(255,215,0,0.6))" : "none",
          animation: currentMood >= 4 ? "pulse 2s ease-in-out infinite" : "none",
          transition: "all 0.3s ease"
        }}>
          {moodEmojis[currentMood - 1]}
        </div>
      </div>

      {/* Sélecteur d'humeur */}
      <div style={{
        display: "flex",
        gap: "3px",
        marginBottom: "8px",
        justifyContent: "center"
      }}>
        {moodEmojis.map((emoji, index) => {
          const isSelected = currentMood === index + 1;
          return (
            <button
              key={index}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                border: isSelected
                  ? "2px solid " + theme.colors.accents.gold
                  : "1px solid rgba(255,255,255,0.2)",
                backgroundColor: isSelected
                  ? `${theme.colors.accents.gold}20`
                  : "rgba(255,255,255,0.05)",
                fontSize: "15px",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                boxShadow: isSelected
                  ? `0 0 8px ${theme.colors.accents.gold}40`
                  : "none",
                transform: isSelected ? "scale(1.1)" : "scale(1)"
              }}
              onClick={() => setCurrentMood(index + 1)}
              aria-label={`Mood ${emoji}`}
            >
              {emoji}
            </button>
          );
        })}
      </div>

      {/* Sliders */}
      {renderSlider(energy, setEnergy, "⚡", theme.colors.accents.success)}
      {renderSlider(focus, setFocus, "🎯", theme.colors.accents.danger)}

      {/* Notes */}
      <textarea
        style={{
          flex: 1,
          minHeight: "40px",
          maxHeight: "70px",
          padding: "6px",
          borderRadius: "4px",
          border: "1px solid rgba(255,255,255,0.2)",
          backgroundColor: "rgba(255,255,255,0.05)",
          color: theme.colors.text?.light || "#F7FAFC",
          fontSize: "11px",
          resize: "none",
          fontFamily: "inherit",
          transition: "all 0.2s ease"
        }}
        placeholder="Note rapide..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </>
  );

  // Vue markdown (éditable ou lecture seule)
  const renderMarkdownView = () => {
    if (isEditing) {
      return (
        <textarea
          style={{
            width: "100%",
            height: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "rgba(255,255,255,0.05)",
            color: theme.colors.text?.light || "#F7FAFC",
            fontSize: "12px",
            fontFamily: theme.typography?.families?.mono || "monospace",
            resize: "none",
            lineHeight: "1.4"
          }}
          placeholder="# Notes\n\nÉcrivez vos notes en markdown...\n\n- Liste\n- **Gras**\n- *Italique*"
          value={markdownText}
          onChange={(e) => saveMarkdown(e.target.value)}
        />
      );
    }

    // Mode lecture - rendu basique du markdown
    return (
      <div style={{
        width: "100%",
        height: "100%",
        padding: "8px",
        overflowY: "auto",
        color: theme.colors.text?.light || "#F7FAFC",
        fontSize: "12px",
        lineHeight: "1.6"
      }}>
        {markdownText ? (
          <div style={{ whiteSpace: "pre-wrap" }}>
            {markdownText.split('\n').map((line, idx) => {
              // Rendu basique du markdown
              let formatted = line;

              // Headers
              if (line.startsWith('# ')) {
                return <h3 key={idx} style={{ fontSize: "16px", marginBottom: "8px" }}>{line.slice(2)}</h3>;
              }
              if (line.startsWith('## ')) {
                return <h4 key={idx} style={{ fontSize: "14px", marginBottom: "6px" }}>{line.slice(3)}</h4>;
              }

              // Liste
              if (line.startsWith('- ')) {
                return <div key={idx} style={{ marginLeft: "16px" }}>• {line.slice(2)}</div>;
              }

              // Ligne vide
              if (!line.trim()) {
                return <br key={idx} />;
              }

              // Texte normal avec gras et italique
              formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
              formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

              return <div key={idx} dangerouslySetInnerHTML={{ __html: formatted }} />;
            })}
          </div>
        ) : (
          <div style={{ opacity: 0.5, fontStyle: "italic" }}>
            Aucune note. Cliquez sur ✏️ pour éditer.
          </div>
        )}
      </div>
    );
  };

  // Vue logs
  const renderLogsView = () => (
    <div style={{
      height: "100%",
      overflowY: "auto",
      padding: "4px"
    }}>
      {localLogs.length === 0 ? (
        <div style={{
          textAlign: "center",
          color: theme.colors.text?.muted || "#E2E8F0",
          fontSize: "11px",
          marginTop: "16px"
        }}>
          Aucun log enregistré
        </div>
      ) : (
        <>
          {(localLogs.length > 1 || context === 'diary') && (
            <div style={{
              marginBottom: "6px",
              textAlign: "center",
              display: "flex",
              gap: "4px",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              {context === 'diary' && (
                <button
                  onClick={handleToggleShowHidden}
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backgroundColor: showHidden ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.05)",
                    color: showHidden ? theme.colors.accents?.gold || "#FFD700" : theme.colors.text?.muted || "#E2E8F0",
                    cursor: "pointer"
                  }}
                >
                  {showHidden ? '👁️ Masquer cachés' : '👁️‍🗨️ Voir cachés'}
                </button>
              )}
              {localLogs.length > 1 && (
              <button
                onClick={handleClearLogs}
                style={{
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "3px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: theme.colors.text?.muted || "#E2E8F0",
                  cursor: "pointer"
                }}
              >
                🗑️ Tout effacer
              </button>
              )}
            </div>
          )}
          {localLogs.slice(-10).reverse().map((log, idx) => {
            const actualIndex = localLogs.length - 1 - idx;
            const time = new Date(log.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            });
            return (
              <div key={`log-${actualIndex}`} style={{
                marginBottom: "4px",
                padding: "4px 20px 4px 6px",
                borderRadius: "3px",
                backgroundColor: "rgba(255,255,255,0.03)",
                fontSize: "10px",
                color: theme.colors.text?.light || "#F7FAFC",
                borderLeft: `2px solid ${log.hidden ? theme.colors.stone || '#708090' : theme.colors.accents.gold}30`,
                opacity: log.hidden ? 0.6 : 1,
                position: "relative"
              }}>
                {context === 'diary' && (
                  <button
                    onClick={() => handleToggleHideLog(log.id)}
                    style={{
                      position: "absolute",
                      right: "2px",
                      top: "2px",
                      background: "none",
                      border: "none",
                      color: log.hidden ? theme.colors.accents?.gold || "#FFD700" : theme.colors.text?.muted || "#E2E8F0",
                      cursor: "pointer",
                      fontSize: "12px",
                      opacity: log.hidden ? 0.8 : 0.5,
                      padding: "2px",
                      lineHeight: "1"
                    }}
                    title={log.hidden ? "Montrer" : "Cacher"}
                  >
                    {log.hidden ? '👁️' : '🚫'}
                  </button>
                )}
                <div style={{
                  fontWeight: "600",
                  marginBottom: "2px",
                  opacity: log.hidden ? 0.5 : 1
                }}>
                  {time} {log.emoji || moodEmojis[log.mood - 1]} {'⚡'.repeat(log.energy)} {'🎯'.repeat(log.focus)}
                  {log.hidden && ' (caché)'}
                </div>
                {log.notes && (
                  <div style={{ opacity: log.hidden ? 0.4 : 0.8 }}>{log.notes}</div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "6px",
      background: `linear-gradient(135deg, ${theme.colors.stone || '#708090'}30 0%, ${theme.colors.secondary || '#D2B48C'}15 100%)`,
      borderRadius: "6px",
      position: "relative"
    }}>
      {/* Animation CSS */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Rendu selon le mode */}
      {viewMode === 'compact' && renderCompactView()}
      {viewMode === 'markdown' && renderMarkdownView()}
      {viewMode === 'logs' && renderLogsView()}
    </div>
  );
};

export default MindLogCompact;