// src/components/rooms/Bibliotheque/BibliothequeRoom.jsx

import React, { useState, useCallback } from "react";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import ProjectsDropdown from "../../room-modules/bibliotheque/ProjectsDropdown";
import ProjectOverviewModal from "../../modals/ProjectOverviewModal/ProjectOverviewModal";
import { useTheme } from "styled-components";

/**
 * Bibliotheque room component for knowledge management
 * @renders BaseRoom
 * @renders PanelGrid
 * @renders Panel
 * @renders ProjectsDropdown
 * @renders ProjectOverviewModal - conditionally rendered when showProjectModal
 */
const BibliothequeRoom = () => {
  const theme = useTheme();
  const [showProjectModal, setShowProjectModal] = useState(false);

  const handleOpenProjectModal = useCallback((_projectId) => {
    setShowProjectModal(true);
  }, []);

  const handleCloseProjectModal = useCallback(() => {
    setShowProjectModal(false);
  }, []);

  return (
    <BaseRoom roomType="bibliotheque" layoutType="grid">
      <PanelGrid columns={5} rows={5}>
        {/* Projets & Archives - Panneau principal */}
        <Panel
          gridColumn="3 / 6"
          gridRow="1 / 4"
          title="Projets & Archives"
          icon="📊"
          texture="wood"
          accentColor={theme.colors.accents.gold}
          collapsible={true}
          collapsed={false}
        >
          <ProjectsDropdown onOpenModal={handleOpenProjectModal} />
        </Panel>

        {/* Espace pour les notes de recherche */}
        <Panel
          gridColumn="1 / 3"
          gridRow="3 / 6"
          title="Notes de Recherche"
          icon="🔍"
          texture="parchment"
          accentColor={theme.colors.accents.cold}
          collapsible={true}
          collapsed={false}
        >
          <div
            style={{ padding: "20px", textAlign: "center", color: "#8b7355" }}
          >
            Notes et recherches
          </div>
        </Panel>

        {/* Espace pour les collections/favoris */}
        <Panel
          gridColumn="3 / 6"
          gridRow="4 / 6"
          title="Collections"
          icon="⭐"
          texture="metal"
          accentColor={theme.colors.accents.success}
          collapsible={true}
          collapsed={false}
        >
          <div
            style={{ padding: "20px", textAlign: "center", color: "#8b7355" }}
          >
            Collections et favoris
          </div>
        </Panel>
      </PanelGrid>

      {/* Modal de gestion des projets */}
      <ProjectOverviewModal
        isOpen={showProjectModal}
        onClose={handleCloseProjectModal}
      />
    </BaseRoom>
  );
};

export default BibliothequeRoom;
