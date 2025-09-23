// src/components/room-modules/laboratoire/ComponentToTest.jsx

// ========================================
// 🧪 GUIDE D'UTILISATION DU LABORATOIRE
// ========================================
// 1. Importer le composant à tester en haut du fichier
// 2. Définir sa configuration dans TEST_CONFIGS
// 3. Changer ACTIVE_TEST pour activer le test
// 4. Le Panel s'adaptera automatiquement via getPanelConfig
//
// Structure d'une config:
// - component: Le composant React à tester
// - props: Les props par défaut du composant
// - panel: Configuration du Panel (titre, icône, etc.)
// - panel.getCustomActions: Fonction pour toolbar custom
// ========================================

import React, { useRef } from 'react';
import MindLogCompact from '../../widgets/MindLog/MindLogCompact';
import MindLogToolbar from '../../common/MindLogToolbar';
import MindLogSorter from '../sanctuaire/MindLogSorter/MindLogSorter';
// import TimeTimer from '../../widgets/TimeTimer';  // Exemple d'import

// ========================================
// CONFIGURATIONS DES TESTS
// ========================================
const TEST_CONFIGS = {
  mindlog: {
    // Configuration du composant
    component: MindLogCompact,
    props: {
      context: 'diary'  // Props par défaut
    },

    // Configuration du Panel nécessaire
    panel: {
      title: "MindLog Test",
      icon: "🧠",
      texture: "wood",
      collapsible: true,
      hideHeaderTitleWhenCollapsed: true,  // Important pour la toolbar
      minWidth: 1,
      minHeight: 2,
      recommendedWidth: 2,
      recommendedHeight: 3,

      // Fonction pour générer customActions avec les handlers
      getCustomActions: (handlers) => handlers ? (
        <MindLogToolbar
          viewMode={handlers.viewMode || 'compact'}
          isEditing={handlers.isEditing || false}
          logsCount={handlers.logsCount || 0}
          onToggleView={() => handlers.handleToggleView?.()}
          onToggleEdit={() => handlers.handleToggleEdit?.()}
          onQuickLog={() => handlers.handleQuickLog?.()}
          onClearLogs={() => handlers.handleClearLogs?.()}
        />
      ) : null
    }
  },

  // Widget Tri Mental
  trimental: {
    component: MindLogSorter,
    props: {
      // Pas de props nécessaires, lit directement le store
    },
    panel: {
      title: "Tri Mental",
      icon: "🧘",
      texture: "stone",
      collapsible: false,
      minWidth: 3,
      minHeight: 2,
      recommendedWidth: 4,
      recommendedHeight: 3
    }
  }
};

// ========================================
// 🎯 COMPOSANT ACTIF (changer ici)
// ========================================
const ACTIVE_TEST = 'trimental';  // ← Changer cette valeur pour tester un autre composant

// State global pour les handlers (nécessaire pour customActions)
let componentHandlers = null;

// ========================================
// EXPORT DE LA CONFIGURATION DU PANEL
// ========================================
export const getPanelConfig = () => {
  const config = TEST_CONFIGS[ACTIVE_TEST];
  if (!config) return {};

  const panelConfig = { ...config.panel };

  // Si getCustomActions existe, l'appeler avec les handlers actuels
  if (panelConfig.getCustomActions) {
    panelConfig.customActions = panelConfig.getCustomActions(componentHandlers);
    delete panelConfig.getCustomActions;  // Nettoyer
  }

  return panelConfig;
};

// ========================================
// COMPOSANT DE TEST PRINCIPAL
// ========================================
const ComponentToTest = ({ panelWidth = 3, panelHeight = 3, collapsed = false, showPanel = true }) => {
  const config = TEST_CONFIGS[ACTIVE_TEST];

  // Si aucune config n'existe
  if (!config) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>
            Aucun test configuré
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            Vérifiez que ACTIVE_TEST = '{ACTIVE_TEST}' existe dans TEST_CONFIGS
          </div>
        </div>
      </div>
    );
  }

  const Component = config.component;

  // Props calculées selon les dimensions du panel
  const computedProps = {
    ...config.props,
    // Props additionnelles basées sur les dimensions
    compact: panelWidth <= 2,
    debug: panelHeight >= 3,
    verbose: panelWidth >= 4 && panelHeight >= 4
  };

  // Handler pour récupérer les actions du composant
  const handleMount = (handlers) => {
    componentHandlers = handlers;
    console.log(`[${ACTIVE_TEST}] Handlers montés:`, handlers);

    // Forcer un re-render du parent pour mettre à jour customActions
    // (Hack: utiliser un event custom)
    window.dispatchEvent(new CustomEvent('lab-component-mounted'));
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Badge d'information en mode debug */}
      {!collapsed && panelHeight >= 3 && (
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          padding: '2px 6px',
          background: 'rgba(0,0,0,0.8)',
          fontSize: '10px',
          color: '#ffd700',
          borderRadius: '4px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>📐</span>
          <span>{panelWidth}×{panelHeight}</span>
          <span style={{ opacity: 0.6 }}>|</span>
          <span>{ACTIVE_TEST}</span>
        </div>
      )}


      {/* Le composant testé */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Component
          {...computedProps}
          onMount={handleMount}
          onLogSave={(log) => {
            console.log(`[${ACTIVE_TEST}][${panelWidth}×${panelHeight}] Log sauvé:`, log);
          }}
        />
      </div>
    </div>
  );
};

export default ComponentToTest;