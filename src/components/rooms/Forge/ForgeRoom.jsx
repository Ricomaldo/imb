// src/components/rooms/Forge/ForgeRoom.jsx

import React, { useState } from "react";
import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import Panel from "../../common/Panel";
import PanelGrid from "../../layout/PanelGrid";
import useNotesStore from "../../../stores/useNotesStore";
import MarkdownEditor from "../../common/MarkdownEditor";
import Button from "../../common/Button";
import ComponentCatalog from "../../dev/ComponentCatalog/ComponentCatalog";
import SystemOverview from "../../dev/SystemOverview/SystemOverview";
import CaptureUrgente from "../../room-modules/forge/CaptureUrgente";
import { ForgeToolbar, ForgeTitle } from "./ForgeRoom.styles";

/**
 * Forge room component for development tools and component testing
 * @renders BaseRoom
 * @renders ForgeTitle
 * @renders ForgeToolbar
 * @renders Button
 * @renders PanelGrid
 * @renders Panel
 * @renders ComponentCatalog
 * @renders SystemOverview
 * @renders MarkdownEditor
 */
const ForgeRoom = () => {
  const theme = useTheme();
  useNotesStore();
  const [showCatalog, setShowCatalog] = useState(false);
  const [showTree, setShowTree] = useState(false);
  const [collapsedPanels, setCollapsedPanels] = useState({
    bugs: false,
    saveStates: false
  });

  return (
    <BaseRoom roomType="forge" layoutType="grid">
      {/* Toolbar en haut, avant la grid */}
      <ForgeToolbar>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            setShowCatalog(!showCatalog);
            setShowTree(false);
          }}
        >
          🔨 PROPS
        </Button>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            setShowTree(!showTree);
            setShowCatalog(false);
          }}
        >
          🌳 TREE
        </Button>
        <Button size="small" variant="secondary">
          🔧 Action 3
        </Button>
        <Button size="small" variant="secondary">
          ⚡ Action 4
        </Button>
      </ForgeToolbar>

      <PanelGrid columns={5} rows={5}>
        {showCatalog ? (
          <Panel
            gridColumn="1/6"
            gridRow="1/6"
            title="Component Props Catalog"
            icon="🔨"
            texture="metal"
            borderType="blue"
            accentColor={theme.colors.cold}
            collapsible={true}
            collapsed={false}
            onToggleCollapse={() => setShowCatalog(false)}
          >
            <ComponentCatalog />
          </Panel>
        ) : showTree ? (
          <Panel
            gridColumn="1/6"
            gridRow="1/6"
            title="Architecture Tree"
            icon="🌳"
            texture="metal"
            borderType="blue"
            accentColor={theme.colors.cold}
            collapsible={true}
            collapsed={false}
            onToggleCollapse={() => setShowTree(false)}
          >
            <SystemOverview />
          </Panel>
        ) : (
          <>
            {/* Panel pour capturer les bugs */}
            <Panel
              gridColumn="1 / 3"
              gridRow="1 / 5"
              title="Capture de Bugs"
              icon="🐛"
              texture="metal"
              borderType="blue"
              accentColor={theme.colors.accents.danger}
              collapsible={true}
              collapsed={collapsedPanels.bugs}
              onToggleCollapse={(collapsed) =>
                setCollapsedPanels(prev => ({ ...prev, bugs: collapsed }))
              }
            >
              <CaptureUrgente
                type="bug"
                storeKey="bugs"
                placeholder={{
                  title: "Ex: Erreur lors de la sauvegarde",
                  description: "Décrivez le problème et comment le reproduire",
                  urgency: "Sélectionnez l'urgence"
                }}
              />
            </Panel>

            {/* Panel pour sauvegarder l'état de développement */}
            <Panel
              gridColumn="4 / 6"
              gridRow="1 / 5"
              title="Pause Projet"
              icon="💾"
              texture="metal"
              borderType="blue"
              accentColor={theme.colors.accents.cold}
              collapsible={true}
              collapsed={collapsedPanels.saveStates}
              onToggleCollapse={(collapsed) =>
                setCollapsedPanels(prev => ({ ...prev, saveStates: collapsed }))
              }
            >
              <CaptureUrgente
                type="saveState"
                storeKey="saveStates"
                placeholder={{
                  title: "Ex: Refactoring système de navigation",
                  description: "État actuel: modification des routes, contexte...",
                  nextAction: "Prochaine étape: finir le composant NavBar"
                }}
              />
            </Panel>


          </>
        )}
      </PanelGrid>
    </BaseRoom>
  );
};

export default ForgeRoom;
