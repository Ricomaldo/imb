// src/components/room-modules/sanctuaire/MomentsOui/MomentsOuiWidget.jsx
// Widget principal Moments OUI - Container orchestrant tous les composants

import React, { useState } from 'react';
import useDiaryStore from '../../../../stores/useDiaryStore';
import CaptureModal from './CaptureModal';
import MomentsTimeline from './MomentsTimeline';
import WeeklyCounter from './WeeklyCounter';
import NeedsMiniHeatmap from './NeedsMiniHeatmap';
import {
  WidgetContainer,
  StatsContainer,
  StatBox,
  PrimaryButton
} from './MomentsOui.styles';

/**
 * MomentsOuiWidget - Widget principal de capture et visualisation des moments OUI
 */
const MomentsOuiWidget = () => {
  // State local
  const [captureModalOpen, setCaptureModalOpen] = useState(false);
  const [editingMoment, setEditingMoment] = useState(null);

  // Store actions
  const getMomentsOui = useDiaryStore(state => state.getMomentsOui);
  const addMomentOui = useDiaryStore(state => state.addMomentOui);
  const updateMomentOui = useDiaryStore(state => state.updateMomentOui);
  const deleteMomentOui = useDiaryStore(state => state.deleteMomentOui);

  // Récupérer les moments (tri chronologique inverse, sans archivés)
  const moments = getMomentsOui({ includeArchived: false });

  /**
   * Ouvrir le formulaire de capture (nouveau moment)
   */
  const handleOpenCapture = () => {
    setEditingMoment(null);
    setCaptureModalOpen(true);
  };

  /**
   * Ouvrir le formulaire d'édition
   */
  const handleEditMoment = (moment) => {
    setEditingMoment(moment);
    setCaptureModalOpen(true);
  };

  /**
   * Sauvegarder un moment (création ou édition)
   */
  const handleSaveMoment = (momentData) => {
    if (editingMoment) {
      // Mode édition
      updateMomentOui(editingMoment.id, momentData);
    } else {
      // Mode création
      addMomentOui(momentData);
    }

    // Fermer la modale
    setCaptureModalOpen(false);
    setEditingMoment(null);
  };

  /**
   * Supprimer un moment
   */
  const handleDeleteMoment = (momentId) => {
    deleteMomentOui(momentId);
  };

  /**
   * Fermer la modale
   */
  const handleCloseModal = () => {
    setCaptureModalOpen(false);
    setEditingMoment(null);
  };

  return (
    <WidgetContainer>
      {/* Stats rapides */}
      <StatsContainer>
        <StatBox>
          <WeeklyCounter />
        </StatBox>
        <StatBox>
          <NeedsMiniHeatmap limit={3} />
        </StatBox>
      </StatsContainer>

      {/* Timeline des moments */}
      <MomentsTimeline
        moments={moments}
        onEdit={handleEditMoment}
        onDelete={handleDeleteMoment}
      />

      {/* Bouton de capture */}
      <PrimaryButton onClick={handleOpenCapture}>
        + Capturer Moment OUI ✨
      </PrimaryButton>

      {/* Modale de capture/édition */}
      <CaptureModal
        isOpen={captureModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveMoment}
        initialData={editingMoment}
      />
    </WidgetContainer>
  );
};

export default MomentsOuiWidget;
