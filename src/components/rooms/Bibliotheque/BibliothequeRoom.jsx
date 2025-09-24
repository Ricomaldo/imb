// src/components/rooms/Bibliotheque/BibliothequeRoom.jsx

import React from 'react';
import BaseRoom from '../../layout/BaseRoom';
import PanelGrid from '../../layout/PanelGrid';
import Panel from '../../common/Panel';
import DiaryArchive from '../../widgets/DiaryArchive/DiaryArchive';
import { useTheme } from 'styled-components';

/**
 * Bibliotheque room component for knowledge management
 * @renders BaseRoom
 * @renders PanelGrid
 * @renders Panel
 */
const BibliothequeRoom = () => {
  const theme = useTheme();

  return (
    <BaseRoom roomType="bibliotheque" layoutType="grid">
      <PanelGrid columns={5} rows={5}>
        {/* Archives du Journal - Petit panneau en haut à gauche */}
        <Panel
          gridColumn="1 / 3"
          gridRow="1 / 3"
          title="Archives du Journal"
          icon="📚"
          texture="parchment"
          accentColor={theme.colors.accents.warm}
          collapsible={true}
          collapsed={false}
        >
          <DiaryArchive />
        </Panel>

        {/* Futurs emplacements pour d'autres contenus de la bibliothèque */}
        {/* Espace principal pour les livres/documents */}
        <Panel
          gridColumn="3 / 6"
          gridRow="1 / 4"
          title="Documents"
          icon="📖"
          texture="wood"
          accentColor={theme.colors.accents.neutral}
          collapsible={true}
          collapsed={false}
        >
          <div style={{ padding: '20px', textAlign: 'center', color: '#8b7355' }}>
            Espace pour vos documents et références
          </div>
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
          <div style={{ padding: '20px', textAlign: 'center', color: '#8b7355' }}>
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
          <div style={{ padding: '20px', textAlign: 'center', color: '#8b7355' }}>
            Collections et favoris
          </div>
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default BibliothequeRoom;
