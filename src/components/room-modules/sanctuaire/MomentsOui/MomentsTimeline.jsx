// src/components/room-modules/sanctuaire/MomentsOui/MomentsTimeline.jsx
// Timeline des moments OUI avec confirmation suppression

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../common/Button';
import MomentCard from './MomentCard';
import {
  TimelineContainer,
  EmptyState,
  ConfirmModal,
  ModalContent,
  ModalTitle,
  ModalText,
  ModalButtons
} from './MomentsOui.styles';

/**
 * MomentsTimeline - Affiche la liste chronologique des moments
 * @param {Array} moments - Liste des moments à afficher
 * @param {Function} onEdit - Callback édition d'un moment
 * @param {Function} onDelete - Callback suppression d'un moment
 */
const MomentsTimeline = ({ moments = [], onEdit, onDelete }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  /**
   * Confirmer la suppression
   */
  const confirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  /**
   * Annuler la suppression
   */
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // État vide
  if (moments.length === 0) {
    return (
      <TimelineContainer>
        <EmptyState>
          <span style={{ fontSize: '48px' }}>✨</span>
          <p>Aucun moment OUI capturé</p>
          <p style={{ fontSize: '11px', opacity: 0.7 }}>
            Commence par capturer ton premier moment de plénitude
          </p>
        </EmptyState>
      </TimelineContainer>
    );
  }

  return (
    <>
      <TimelineContainer>
        {moments.map(moment => (
          <MomentCard
            key={moment.id}
            moment={moment}
            onEdit={onEdit}
            onDelete={setDeleteConfirm}
          />
        ))}
      </TimelineContainer>

      {/* Modal de confirmation de suppression */}
      {deleteConfirm && (
        <ConfirmModal onClick={cancelDelete}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>⚠️ Supprimer ce moment ?</ModalTitle>
            <ModalText>
              Cette action est définitive. Le moment sera supprimé de l'historique.
            </ModalText>
            <ModalText style={{ fontSize: '11px', fontStyle: 'italic', marginTop: '8px' }}>
              "{deleteConfirm.quoi}"
            </ModalText>
            <ModalButtons>
              <Button variant="secondary" onClick={cancelDelete}>
                Annuler
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Supprimer
              </Button>
            </ModalButtons>
          </ModalContent>
        </ConfirmModal>
      )}
    </>
  );
};

MomentsTimeline.propTypes = {
  moments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      timestamp: PropTypes.string.isRequired,
      quoi: PropTypes.string.isRequired,
      pourquoi: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
      archived: PropTypes.bool
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

MomentsTimeline.defaultProps = {
  moments: []
};

export default MomentsTimeline;
