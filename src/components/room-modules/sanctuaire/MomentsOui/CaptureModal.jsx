// src/components/room-modules/sanctuaire/MomentsOui/CaptureModal.jsx
// Modale de capture d'un moment OUI (3 champs)

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../common/Modal/Modal';
import Button from '../../../common/Button';
import NeedsSelector from './NeedsSelector';
import {
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  CharCount
} from './MomentsOui.styles';

/**
 * CaptureModal - Formulaire de capture/édition d'un moment OUI
 * @param {boolean} isOpen - Modale ouverte
 * @param {Function} onClose - Callback fermeture
 * @param {Function} onSave - Callback sauvegarde (momentData)
 * @param {Object} initialData - Données initiales pour édition (optionnel)
 */
const CaptureModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  // État du formulaire
  const [formData, setFormData] = useState({
    quand: '',
    quoi: '',
    pourquoi: '',
    tags: []
  });

  // Limites de caractères
  const LIMITS = {
    quoi: 200,
    pourquoi: 500
  };

  // Initialiser le formulaire
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Mode édition
        setFormData({
          quand: initialData.timestamp?.split('T')[0] + 'T' + initialData.timestamp?.split('T')[1]?.substring(0, 5) || '',
          quoi: initialData.quoi || '',
          pourquoi: initialData.pourquoi || '',
          tags: initialData.tags || []
        });
      } else {
        // Mode création - pré-remplir avec date/heure actuelle
        const now = new Date();
        const localDateTime = now.toISOString().slice(0, 16); // Format YYYY-MM-DDTHH:mm
        setFormData({
          quand: localDateTime,
          quoi: '',
          pourquoi: '',
          tags: []
        });
      }
    }
  }, [isOpen, initialData]);

  /**
   * Gestion des changements de champs
   */
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Validation du formulaire
   */
  const isValid = () => {
    return (
      formData.quoi.trim().length > 0 &&
      formData.pourquoi.trim().length > 0 &&
      formData.quoi.length <= LIMITS.quoi &&
      formData.pourquoi.length <= LIMITS.pourquoi
    );
  };

  /**
   * Sauvegarde
   */
  const handleSave = () => {
    if (!isValid()) return;

    // Convertir la date locale en ISO string
    const quandISO = formData.quand ? new Date(formData.quand).toISOString() : new Date().toISOString();

    onSave({
      quand: quandISO,
      quoi: formData.quoi.trim(),
      pourquoi: formData.pourquoi.trim(),
      tags: formData.tags
    });

    // Reset et fermeture
    onClose();
  };

  /**
   * Annulation
   */
  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={initialData ? '✏️ Modifier Moment OUI' : '✨ Capturer un Moment OUI'}
      size="medium"
      closeOnOverlay={false}
      footer={
        <>
          <Button variant="secondary" onClick={handleCancel}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isValid()}
          >
            {initialData ? 'Mettre à jour' : 'Capturer ✨'}
          </Button>
        </>
      }
    >
      {/* Champ 1: Quand */}
      <FormGroup>
        <FormLabel>
          📅 Quand
        </FormLabel>
        <FormInput
          type="datetime-local"
          value={formData.quand}
          onChange={(e) => handleChange('quand', e.target.value)}
        />
      </FormGroup>

      {/* Champ 2: Quoi */}
      <FormGroup>
        <FormLabel>
          ✍️ Quoi
        </FormLabel>
        <FormTextarea
          value={formData.quoi}
          onChange={(e) => handleChange('quoi', e.target.value)}
          placeholder="Décris brièvement ce moment..."
          $minHeight="60px"
          maxLength={LIMITS.quoi}
        />
        <CharCount $over={formData.quoi.length > LIMITS.quoi}>
          {formData.quoi.length} / {LIMITS.quoi}
        </CharCount>
      </FormGroup>

      {/* Champ 3: Pourquoi */}
      <FormGroup>
        <FormLabel>
          💡 Pourquoi nourrissant
        </FormLabel>
        <FormTextarea
          value={formData.pourquoi}
          onChange={(e) => handleChange('pourquoi', e.target.value)}
          placeholder="Quel(s) besoin(s) ont été satisfaits ?"
          $minHeight="80px"
          maxLength={LIMITS.pourquoi}
        />
        <CharCount $over={formData.pourquoi.length > LIMITS.pourquoi}>
          {formData.pourquoi.length} / {LIMITS.pourquoi}
        </CharCount>
      </FormGroup>

      {/* Sélecteur de besoins */}
      <FormGroup>
        <FormLabel>
          🏷️ Besoins satisfaits
        </FormLabel>
        <NeedsSelector
          selectedNeeds={formData.tags}
          onChange={(tags) => handleChange('tags', tags)}
          maxSelection={5}
        />
      </FormGroup>
    </Modal>
  );
};

CaptureModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.number,
    timestamp: PropTypes.string,
    quoi: PropTypes.string,
    pourquoi: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  })
};

CaptureModal.defaultProps = {
  initialData: null
};

export default CaptureModal;
