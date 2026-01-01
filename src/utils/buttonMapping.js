// src/utils/buttonMapping.js

// Store centralisé pour les handlers de modales
let modalHandlers = {};

// Fonction pour enregistrer les handlers
export const registerModalHandler = (id, handler) => {
  modalHandlers[id] = handler;
};

// Fonction pour déclencher une modale
export const openModal = (modalId) => {
  if (modalHandlers[modalId]) {
    modalHandlers[modalId]();
  } else {
    console.warn(`Modal handler not found for: ${modalId}`);
  }
};

// ---- TowerHeader: Actions globales (Sync + Settings) ----
export const globalActions = [
  { id: 'sync', icon: '🔄', label: 'Synchronisation', onClick: () => openModal('sync') },
  { id: 'config', icon: '⚙️', label: 'Paramètres', onClick: () => openModal('settings') },
  { id: 'header-wip-1', icon: '🚧', label: 'WIP', onClick: () => {}, placeholder: true },
  { id: 'header-wip-2', icon: '🚧', label: 'WIP', onClick: () => {}, placeholder: true },
];

// ---- TowerToolbar: onglets thématiques ----
export const toolbarTabs = [
  { id: 'viewer', icon: '👁️', label: 'Viewer' },
  { id: 'projects', icon: '📊', label: 'Projets' },
  { id: 'test-ui', icon: '🧪', label: 'Test UI' },
  { id: 'wip', icon: '🚧', label: 'WIP' },
];

export const toolbarItemsByTab = {
  viewer: [
    { id: 'notes', icon: '📝', label: 'Notes', viewerType: 'notes' },
    { id: 'timer', icon: '⏱️', label: 'Timer', viewerType: 'timer' },
    { id: 'calendar', icon: '🚧', label: 'Calendrier', action: () => {}, placeholder: true },
    { id: 'viewer-wip-1', icon: '🚧', label: 'WIP', action: () => {}, placeholder: true },
  ],
  projects: [
    { id: 'projects', icon: '📊', label: 'Projets', action: () => openModal('projects') },
    { id: 'capture', icon: '📷', label: 'Capture', action: () => openModal('capture-confirm') },
    { id: 'project-wip-1', icon: '🚧', label: 'WIP', action: () => {}, placeholder: true },
  ],
  'test-ui': [
    { id: 'modal-small', icon: '💚', label: 'Modal S', action: () => openModal('potion-heal') },
    { id: 'modal-medium', icon: '💤', label: 'Modal M', action: () => openModal('potion-sleep') },
    { id: 'modal-large', icon: '💪', label: 'Modal L', action: () => openModal('potion-strength') },
  ],
  wip: [
    { id: 'wip-1', icon: '🚧', label: 'WIP', action: () => {}, placeholder: true },
    { id: 'wip-2', icon: '🚧', label: 'WIP', action: () => {}, placeholder: true },
    { id: 'wip-3', icon: '🚧', label: 'WIP', action: () => {}, placeholder: true },
  ],
};
