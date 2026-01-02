// src/components/modals/ModalManager.jsx

import React, { useState, useEffect, useRef } from 'react';
import { registerModalHandler } from '../../utils/buttonMapping';
import { HealingPotionModal, SleepPotionModal, StrengthPotionModal } from './PotionModals';
import SyncModal from './SyncModal/SyncModal';
import SettingsModal from './SettingsModal/SettingsModal';
import ProjectOverviewModal from './ProjectOverviewModal/ProjectOverviewModal';
import CaptureConfirmModal from './CaptureConfirmModal/CaptureConfirmModal';
import TimeTimerModal from './TimeTimerModal/TimeTimerModal';
import DeviceChoiceModal from './DeviceChoiceModal/DeviceChoiceModal';
import { logger } from '../../utils/logger';

/**
 * Manager component that renders all modals in the application
 * @renders HealingPotionModal
 * @renders SleepPotionModal
 * @renders StrengthPotionModal
 * @renders SyncModal
 * @renders SettingsModal
 * @renders ProjectOverviewModal
 * @renders CaptureConfirmModal
 * @renders TimeTimerModal
 * @renders DeviceChoiceModal
 */
const ModalManager = () => {
  // État pour chaque modale
  const [modalStates, setModalStates] = useState({
    'potion-heal': false,
    'potion-sleep': false,
    'potion-strength': false,
    'sync': false,
    'settings': false,
    'projects': false,
    'capture-confirm': false,
    'time-timer': false,
    'device-choice': false,
  });

  // Utiliser une ref pour stocker la fonction de setState
  const modalStatesRef = useRef(modalStates);
  modalStatesRef.current = modalStates;

  // Fonction générique pour fermer une modale
  const closeModal = (modalId) => {
    setModalStates(prev => ({ ...prev, [modalId]: false }));
  };

  // Enregistrer les handlers au montage et quand de nouvelles modales sont ajoutées
  useEffect(() => {
    // Fonction stable qui utilise setModalStates
    const openModal = (modalId) => {
      setModalStates(() => {
        // Créer un nouvel état avec toutes les modales fermées sauf celle demandée
        const newState = {};
        Object.keys(modalStatesRef.current).forEach(key => {
          newState[key] = key === modalId;
        });
        return newState;
      });
    };

    // Enregistrer les handlers pour toutes les modales définies
    Object.keys(modalStates).forEach(modalId => {
      registerModalHandler(modalId, () => openModal(modalId));
    });
    
    logger.debug('✅ Handlers enregistrés pour:', Object.keys(modalStates));
  }, [Object.keys(modalStates).join(',')]); // Re-run si la liste des modales change

  return (
    <>
      <HealingPotionModal
        isOpen={modalStates['potion-heal']}
        onClose={() => closeModal('potion-heal')}
      />

      <SleepPotionModal
        isOpen={modalStates['potion-sleep']}
        onClose={() => closeModal('potion-sleep')}
      />

      <StrengthPotionModal
        isOpen={modalStates['potion-strength']}
        onClose={() => closeModal('potion-strength')}
      />

      <SyncModal
        isOpen={modalStates['sync']}
        onClose={() => closeModal('sync')}
      />

      <SettingsModal
        isOpen={modalStates['settings']}
        onClose={() => closeModal('settings')}
      />

      <ProjectOverviewModal
        isOpen={modalStates['projects']}
        onClose={() => closeModal('projects')}
      />

      <CaptureConfirmModal
        isOpen={modalStates['capture-confirm']}
        onClose={() => closeModal('capture-confirm')}
      />

      <TimeTimerModal
        isOpen={modalStates['time-timer']}
        onClose={() => closeModal('time-timer')}
      />

      <DeviceChoiceModal
        isOpen={modalStates['device-choice']}
        onClose={() => closeModal('device-choice')}
      />
    </>
  );
};

export default ModalManager;