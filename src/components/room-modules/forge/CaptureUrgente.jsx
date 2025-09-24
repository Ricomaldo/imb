// src/components/room-modules/forge/CaptureUrgente.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  CaptureContainer,
  CaptureForm,
  FieldGroup,
  Label,
  Input,
  TextArea,
  Select,
  ButtonGroup,
  CaptureButton,
  CancelButton,
  SuccessMessage
} from './CaptureUrgente.styles';
import useProjectMetaStore from '../../../stores/useProjectMetaStore';
import { useProjectData } from '../../../stores/useProjectDataStore';

/**
 * Composant pour capturer rapidement bugs et états de développement
 * Transforme l'impulsion "je dois finir maintenant" en capture structurée
 */
const CaptureUrgente = ({
  type = 'bug',
  storeKey,
  onCapture,
  placeholder = {}
}) => {
  const { selectedProject } = useProjectMetaStore();
  const projectData = useProjectData(selectedProject);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    urgency: type === 'bug' ? 'cosmetic' : ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Placeholders par défaut selon le type
  const defaultPlaceholders = {
    bug: {
      title: 'Résumé du bug en quelques mots',
      description: 'Description détaillée : étapes pour reproduire, comportement attendu vs obtenu',
      urgency: 'Niveau d\'urgence'
    },
    saveState: {
      title: 'Titre de la sauvegarde',
      description: 'État actuel du développement, fichiers modifiés, contexte',
      nextAction: 'Prochaine action à effectuer pour reprendre'
    }
  };

  const finalPlaceholders = {
    ...defaultPlaceholders[type],
    ...placeholder
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    const captureData = {
      type,
      title: formData.title,
      description: formData.description,
      ...(type === 'bug'
        ? { urgency: formData.urgency }
        : { nextAction: formData.urgency }
      ),
      timestamp: new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Ajouter au store de données du projet
    const actualStoreKey = storeKey || (type === 'bug' ? 'bugs' : 'saveStates');

    // Récupérer les captures existantes ou créer un tableau vide
    const existingCaptures = projectData[actualStoreKey] || [];

    // Ajouter la nouvelle capture
    const newCapture = {
      id: Date.now(),
      ...captureData
    };

    // Mettre à jour le store avec la nouvelle capture
    projectData.updateModuleState(actualStoreKey, [...existingCaptures, newCapture]);

    // Callback optionnel
    if (onCapture) {
      onCapture(captureData);
    }

    // Reset formulaire
    setFormData({
      title: '',
      description: '',
      urgency: type === 'bug' ? 'cosmetic' : ''
    });

    // Afficher message de succès
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      urgency: type === 'bug' ? 'cosmetic' : ''
    });
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <CaptureContainer>
      {showSuccess && (
        <SuccessMessage>
          ✅ Capture enregistrée avec succès !
        </SuccessMessage>
      )}

      <CaptureForm onSubmit={handleSubmit}>
        <FieldGroup>
          <Label htmlFor="title">
            {type === 'bug' ? '🐛 Titre du bug' : '💾 Nom de la sauvegarde'}
          </Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleChange('title')}
            placeholder={finalPlaceholders.title}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="description">
            {type === 'bug' ? '📝 Description' : '📋 État actuel'}
          </Label>
          <TextArea
            id="description"
            value={formData.description}
            onChange={handleChange('description')}
            placeholder={finalPlaceholders.description}
            rows={4}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="urgency">
            {type === 'bug' ? '🚨 Urgence' : '➡️ Prochaine étape'}
          </Label>
          {type === 'bug' ? (
            <Select
              id="urgency"
              value={formData.urgency}
              onChange={handleChange('urgency')}
            >
              <option value="bloquant">🔴 Bloquant</option>
              <option value="genant">🟡 Gênant</option>
              <option value="cosmetic">🔵 Cosmétique</option>
            </Select>
          ) : (
            <TextArea
              id="urgency"
              value={formData.urgency}
              onChange={handleChange('urgency')}
              placeholder={finalPlaceholders.nextAction}
              rows={2}
            />
          )}
        </FieldGroup>

        <ButtonGroup>
          <CaptureButton type="submit">
            {type === 'bug' ? '🐛 Capturer Bug' : '💾 Sauvegarder État'}
          </CaptureButton>
          <CancelButton type="button" onClick={handleCancel}>
            Annuler
          </CancelButton>
        </ButtonGroup>
      </CaptureForm>
    </CaptureContainer>
  );
};

CaptureUrgente.propTypes = {
  type: PropTypes.oneOf(['bug', 'saveState']),
  storeKey: PropTypes.string,
  onCapture: PropTypes.func,
  placeholder: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    urgency: PropTypes.string,
    nextAction: PropTypes.string
  })
};

export default CaptureUrgente;