// src/components/room-modules/laboratoire/ComponentToTest.jsx
// 🧪 COMPOSANT DE TEST - MindLog Avancé (Version React Native adaptée)

import React, { useState, useCallback } from "react";

const MindLog = ({
  size = 300,
  colorScheme = "medieval",
  onLogSave = null,
}) => {
  const [currentMood, setCurrentMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [focus, setFocus] = useState(5);
  const [notes, setNotes] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStart, setSessionStart] = useState(null);

  // Color schemes
  const colors = {
    medieval: {
      primary: "#8B4513",
      secondary: "#D2691E",
      accent: "#DAA520",
      background: "#2F1B14",
      text: "#F5DEB3",
    },
  };

  const theme = colors[colorScheme];

  // Mood labels
  const moodLabels = [
    "😫",
    "😔",
    "😐",
    "🙂",
    "😊",
    "😄",
    "🤩",
    "✨",
    "🔥",
    "⚡",
  ];

  const generateLog = useCallback(() => {
    const timestamp = new Date().toISOString();
    const sessionDuration = sessionStart
      ? Math.round((Date.now() - sessionStart) / 1000 / 60)
      : 0;

    return {
      timestamp,
      mood: currentMood,
      energy,
      focus,
      notes: notes.trim(),
      sessionType: sessionActive ? "active" : "checkpoint",
      sessionDuration,
      context: {
        hour: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
      },
    };
  }, [currentMood, energy, focus, notes, sessionActive, sessionStart]);

  const handleStartSession = () => {
    setSessionActive(true);
    setSessionStart(Date.now());
    const log = generateLog();
    onLogSave?.(log);
  };

  const handleEndSession = () => {
    const log = generateLog();
    onLogSave?.(log);
    setSessionActive(false);
    setSessionStart(null);
    resetForm();
  };

  const handleQuickLog = () => {
    const log = generateLog();
    onLogSave?.(log);
    resetForm();
  };

  const resetForm = () => {
    setCurrentMood(5);
    setEnergy(5);
    setFocus(5);
    setNotes("");
  };

  const renderSlider = (value, setValue, label, min = 1, max = 10) => (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          color: theme.text,
          fontWeight: "600",
          display: "block",
          marginBottom: "10px",
        }}
      >
        {label}
      </label>
      <div
        style={{ display: "flex", gap: "5px", justifyContent: "space-between" }}
      >
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((num) => (
          <button
            key={num}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: `1px solid ${theme.primary}`,
              backgroundColor: value === num ? theme.accent : theme.secondary,
              color: value === num ? theme.background : theme.text,
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={() => setValue(num)}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: theme.background,
        padding: "20px",
        borderRadius: "12px",
        height: "100%",
        overflowY: "auto",
        color: theme.text,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ color: theme.accent, marginBottom: "10px" }}>
          🧠 MindLog
        </h2>
        <div style={{ fontSize: `${size * 0.12}px` }}>
          {moodLabels[currentMood - 1]}
        </div>
      </div>

      {/* Mood Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            color: theme.text,
            fontWeight: "600",
            display: "block",
            marginBottom: "10px",
          }}
        >
          Humeur
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "5px",
          }}
        >
          {moodLabels.map((emoji, index) => (
            <button
              key={index}
              style={{
                aspectRatio: "1",
                borderRadius: "8px",
                border: "none",
                backgroundColor:
                  currentMood === index + 1 ? theme.accent : "transparent",
                fontSize: "20px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => setCurrentMood(index + 1)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      {renderSlider(energy, setEnergy, "⚡ Énergie")}
      {renderSlider(focus, setFocus, "🎯 Focus")}

      {/* Notes */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            color: theme.text,
            fontWeight: "600",
            display: "block",
            marginBottom: "10px",
          }}
        >
          📝 Context/Notes
        </label>
        <textarea
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "12px",
            borderRadius: "8px",
            border: `1px solid ${theme.primary}`,
            backgroundColor: theme.secondary + "20",
            color: theme.text,
            fontSize: "14px",
            resize: "vertical",
            boxSizing: "border-box",
          }}
          placeholder="Projet actuel, état d'esprit, observations..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {!sessionActive ? (
          <>
            <button
              style={{
                flex: 1,
                padding: "12px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: theme.accent,
                color: theme.background,
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={handleStartSession}
            >
              🚀 Début Session
            </button>
            <button
              style={{
                flex: 1,
                padding: "12px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: theme.secondary,
                color: theme.text,
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={handleQuickLog}
            >
              📊 Log Rapide
            </button>
          </>
        ) : (
          <button
            style={{
              flex: 1,
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: theme.primary,
              color: theme.text,
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={handleEndSession}
          >
            ⏹️ Fin Session
          </button>
        )}
      </div>

      {sessionActive && (
        <div style={{ textAlign: "center", padding: "10px" }}>
          <span
            style={{ color: theme.accent, fontSize: "14px", fontWeight: "600" }}
          >
            🔴 Session active depuis{" "}
            {sessionStart
              ? Math.round((Date.now() - sessionStart) / 1000 / 60)
              : 0}
            min
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Composant de test pour le laboratoire - MindLog Avancé
 * @renders MindLog
 */
const ComponentToTest = () => {
  const handleLogSave = (log) => {
    console.log("📊 MindLog saved:", log);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a1a1a",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "100%",
          maxHeight: "600px",
        }}
      >
        <MindLog size={300} colorScheme="medieval" onLogSave={handleLogSave} />
      </div>
    </div>
  );
};

export default ComponentToTest;
