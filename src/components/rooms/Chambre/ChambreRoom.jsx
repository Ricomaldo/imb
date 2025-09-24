// src/components/rooms/Chambre/ChambreRoom.jsx

import React from "react";
import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import useNotesStore from "../../../stores/useNotesStore";
import usePreferencesStore from "../../../stores/usePreferencesStore";
import MarkdownEditor from "../../common/MarkdownEditor";
import ImageDisplay from "../../widgets/ImageDisplay/ImageDisplay";
import QuoteCarousel from "../../widgets/QuoteCarousel/QuoteCarousel";
import NavigationGrid from "../../room-modules/chambre/NavigationGrid";
import TimeTimer from "../../widgets/TimeTimer";
import MindLogCompact from "../../widgets/MindLog/MindLogCompact";
import MindLogToolbar from "../../common/MindLogToolbar";
import { ChambreTitle } from "./ChambreRoom.styles";
import lionImage from "../../../assets/images/totems/Lion.png";

/**
 * Chambre room component for personal space and timers
 * @renders BaseRoom
 * @renders ChambreTitle
 * @renders PanelGrid
 * @renders Panel
 * @renders div
 * @renders p
 * @renders small
 * @renders MarkdownEditor
 */
const ChambreRoom = () => {
  const theme = useTheme();
  const { roomNotes, updateRoomNote } = useNotesStore();
  const { getPanelState, updatePanelState } = usePreferencesStore();
  const chambreNotes = roomNotes.chambre || "";

  // Référence pour le handler de log du MindLog
  const mindLogHandlerRef = React.useRef(null);

  return (
    <BaseRoom roomType="chambre" layoutType="grid">
      <PanelGrid columns={4} rows={4}>
        {/* Totem - 1x1 en haut à droite */}
        <Panel
          gridColumn="2 / 3"
          gridRow="1 / 3"
          title="Totem"
          icon="🗿"
          texture="stone"
          accentColor={theme.colors.accents.nature}
          collapsible={true}
          collapsed={getPanelState("chambre", "totem").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("chambre", "totem", { collapsed: val })
          }
        >
          <ImageDisplay src={lionImage} alt="Lion Totem" hoverEffect={true} />
        </Panel>
        {/* Timer Zone */}
        <Panel
          gridColumn="3 / 5"
          gridRow="3 / 5"
          title="TimeTimer"
          icon="⏰"
          texture="wood"
          accentColor={theme.colors.accents.warm}
          transparentContent={true}
          collapsible={true}
          collapsed={getPanelState("chambre", "timer").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("chambre", "timer", { collapsed: val })
          }
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: theme.spacing.md,
            }}
          >
            <TimeTimer colorSelect={true} maxSize={300} />
          </div>
        </Panel>

        {/* MindLog - 1x2 en haut à gauche */}
        <Panel
          gridColumn="1 / 2"
          gridRow="1 / 3"
          title="MindLog"
          icon="🌈"
          texture="leather"
          accentColor={theme.colors.accents.cold}
          collapsible={true}
          collapsed={getPanelState("chambre", "mindlog").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("chambre", "mindlog", { collapsed: val })
          }
          hideHeaderTitleWhenCollapsed={true}
          customActions={
            <MindLogToolbar
              viewMode={mindLogHandlerRef.current?.viewMode || 'compact'}
              isEditing={mindLogHandlerRef.current?.isEditing || false}
              logsCount={mindLogHandlerRef.current?.logsCount || 0}
              onToggleView={() => mindLogHandlerRef.current?.handleToggleView?.()}
              onToggleEdit={() => mindLogHandlerRef.current?.handleToggleEdit?.()}
              onQuickLog={() => mindLogHandlerRef.current?.handleQuickLog?.()}
              onClearLogs={() => mindLogHandlerRef.current?.handleClearLogs?.()}
              showEditButton={true}
              showClearButton={false}
            />
          }
        >
          <MindLogCompact
            context="diary"
            onMount={(handlers) => {
              mindLogHandlerRef.current = handlers;
            }}
            onLogSave={(log) => {
              console.log("📊 MindLog saved (diary):", log);
            }}
          />
        </Panel>

        {/* Mantra - 2x1 ligne 3 */}
        <Panel
          gridColumn="1 / 3"
          gridRow="3 / 4"
          title="Mantras"
          icon="🕉️"
          texture="fabric"
          accentColor={theme.colors.accents.warm}
          contentType="mantras"
          collapsible={true}
          collapsed={getPanelState("chambre", "mantra").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("chambre", "mantra", { collapsed: val })
          }
        >
          <QuoteCarousel showCategory={false} infinite={true} random={true} />
        </Panel>

        {/* Notes - 2x1 ligne 4 */}
        <Panel
          gridColumn="1 / 3"
          gridRow="4 / 5"
          title="Notes"
          icon="📝"
          texture="parchment"
          accentColor={theme.colors.accents.cold}
          contentType="markdown"
          collapsible={true}
          collapsed={getPanelState("chambre", "notes").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("chambre", "notes", { collapsed: val })
          }
        >
          <MarkdownEditor
            value={chambreNotes}
            onChange={(value) => updateRoomNote("chambre", value)}
            placeholder="Notes personnelles..."
            height="100%"
            compact={true}
            variant="embedded"
            accentColor={theme.colors.accents.cold}
          />
        </Panel>

        {/* Navigation - 2x1 ligne 4 */}
        <Panel
          gridColumn="3 / 5"
          gridRow="1 / 3"
          title="Navigation"
          icon="🧭"
          texture="metal"
          accentColor={theme.colors.accents.neutral}
          collapsible={true}
          collapsed={getPanelState("chambre", "navigation").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("chambre", "navigation", { collapsed: val })
          }
        >
          <NavigationGrid />
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default ChambreRoom;
