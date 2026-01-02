// src/components/rooms/Laboratoire/LaboratoireRoom.jsx
// LABO SANDBOX - Espace de test et expérimentation

import { useState, useEffect } from "react";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import { useTheme } from "styled-components";
import {
  ControlHeader,
  LaboTitle,
  WelcomeContent,
  WelcomeEmoji,
  WelcomeTitle,
  WelcomeDescription,
  WelcomeHint,
  NoPanelContent,
  LargeEmoji,
  NoPanelSubtitle,
  NoPanelCenter,
} from "./LaboratoireRoom.styles";
import Button from "../../common/Button";
import ComponentToTest, { getPanelConfig } from "../../room-modules/laboratoire/ComponentToTest";

/**
 * Laboratoire room component for testing and experimenting with components
 * @renders BaseRoom
 * @renders ControlHeader
 * @renders LaboTitle
 * @renders Button
 * @renders PanelGrid
 * @renders Panel - conditionally rendered when showPanel
 * @renders ComponentToTest - conditionally rendered based on ComponentToTest availability
 * @renders NoPanelContent - conditionally rendered when not showPanel
 */
const LaboratoireRoom = () => {
  const theme = useTheme();
  const [panelWidth, setPanelWidth] = useState(4);
  const [panelHeight, setPanelHeight] = useState(3);
  const [showPanel, setShowPanel] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [, forceUpdate] = useState(0);

  // Récupérer la config du Panel depuis ComponentToTest
  const panelConfig = getPanelConfig();

  // Écouter l'event de montage du composant pour mettre à jour customActions
  useEffect(() => {
    const handleComponentMount = () => {
      forceUpdate(prev => prev + 1);  // Force re-render pour mettre à jour customActions
    };
    window.addEventListener('lab-component-mounted', handleComponentMount);
    return () => window.removeEventListener('lab-component-mounted', handleComponentMount);
  }, []);

  // Fonction pour obtenir le variant selon la valeur
  const getButtonVariant = (value, currentValue) => {
    if (value === currentValue) return "primary";
    const variants = {
      1: "cool", // Bleu
      2: "warm", // Doré
      3: "nature", // Vert
      4: "primary-colored", // Principal
      5: "danger", // Rouge
    };
    return variants[value] || "default";
  };

  // Calcul position - commence à la 1ère rangée, 1ère colonne
  const getGridPosition = () => {
    if (!showPanel) return null;

    const startCol = 1;
    const endCol = startCol + panelWidth;
    const startRow = 1;
    const endRow = startRow + panelHeight;

    return {
      gridColumn: `${startCol} / ${endCol}`,
      gridRow: `${startRow} / ${endRow}`,
    };
  };

  const gridPos = getGridPosition();

  return (
    <BaseRoom roomType="laboratoire" layoutType="grid">
      {/* Barre de contrôles des dimensions */}
      <ControlHeader>
        <LaboTitle>🧪 Rendu </LaboTitle>
        <Button
          size="small"
          variant={showPanel ? "secondary" : "primary"}
          onClick={() => setShowPanel(!showPanel)}
          style={{ marginRight: "12px" }}
        >
          {showPanel ? "👁️" : "∅"}
        </Button>

        <span
          style={{ color: "#ffd700", marginRight: "8px", fontWeight: "bold" }}
        >
          W:
        </span>
        {[1, 2, 3, 4, 5].map((w) => (
          <Button
            key={`w-${w}`}
            size="small"
            variant={getButtonVariant(w, panelWidth)}
            active={panelWidth === w}
            onClick={() => setPanelWidth(w)}
          >
            {w}
          </Button>
        ))}

        <span style={{ color: "#ffd700", margin: "0 8px", fontWeight: "bold" }}>
          H:
        </span>
        {[1, 2, 3, 4, 5].map((h) => (
          <Button
            key={`h-${h}`}
            size="small"
            variant={getButtonVariant(h, panelHeight)}
            active={panelHeight === h}
            onClick={() => setPanelHeight(h)}
          >
            {h}
          </Button>
        ))}
      </ControlHeader>

      {/* Grille 5x5 prenant toute la place */}
      <PanelGrid columns={5} rows={5} style={{ flex: 1 }}>
        {showPanel ? (
          // Avec Panel
          <Panel
            gridColumn={gridPos.gridColumn}
            gridRow={gridPos.gridRow}
            // Props de base avec fallback
            title={panelConfig.title || "Test Component"}
            icon={panelConfig.icon || "🔬"}
            texture={panelConfig.texture || "wood"}
            accentColor={panelConfig.accentColor || theme.colors.accents.warm}
            // Props de configuration du panel
            collapsible={panelConfig.collapsible !== false}
            collapsed={collapsed}
            onToggleCollapse={setCollapsed}
            hideHeaderTitleWhenCollapsed={panelConfig.hideHeaderTitleWhenCollapsed}
            customActions={panelConfig.customActions}
          >
            {ComponentToTest ? (
              <ComponentToTest
                panelWidth={panelWidth}
                panelHeight={panelHeight}
                collapsed={collapsed}
                showPanel={showPanel}
              />
            ) : (
              <WelcomeContent>
                <WelcomeEmoji>👋</WelcomeEmoji>
                <WelcomeTitle>Labo Sandbox</WelcomeTitle>
                <WelcomeDescription>
                  Panel {panelWidth}×{panelHeight}
                </WelcomeDescription>
                <WelcomeHint>💡 Importe un composant ligne 14</WelcomeHint>
              </WelcomeContent>
            )}
          </Panel>
        ) : (
          // Sans Panel - Contenu direct
          <NoPanelContent>
            {ComponentToTest ? (
              <ComponentToTest
                panelWidth={5}
                panelHeight={5}
                collapsed={false}
                showPanel={false}
              />
            ) : (
              <NoPanelCenter>
                <LargeEmoji>👋</LargeEmoji>
                <WelcomeTitle>Mode Sans Panel</WelcomeTitle>
                <NoPanelSubtitle>
                  Affichage direct dans la grille 5×5
                </NoPanelSubtitle>
              </NoPanelCenter>
            )}
          </NoPanelContent>
        )}
      </PanelGrid>
    </BaseRoom>
  );
};

export default LaboratoireRoom;
