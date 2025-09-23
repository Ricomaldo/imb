// src/components/modals/SettingsModal/SettingsModal.jsx - Modale des paramètres

import React, { useState } from 'react';
import Modal from '../../common/Modal/Modal';
import {
  SettingsContainer,
  SettingsSection,
  SettingsTitle,
  SettingsDescription,
  InputGroup,
  Label,
  Select,
  StatusMessage,
  SaveButton
} from './SettingsModal.styles';
import usePreferencesStore from '../../../stores/usePreferencesStore';
import { roomConfig } from '../../../utils/roomPositions';

/**
 * Settings modal for configuring application preferences
 * @renders Modal
 * @renders SettingsContainer
 * @renders SettingsSection
 * @renders SettingsTitle
 * @renders SettingsDescription
 * @renders InputGroup
 * @renders Label
 * @renders Select
 * @renders option
 * @renders SaveButton
 * @renders StatusMessage
 */
const SettingsModal = ({ isOpen, onClose }) => {
  const { defaultRoom, setDefaultRoom } = usePreferencesStore();
  const [selectedRoom, setSelectedRoom] = useState(
    `${defaultRoom.x},${defaultRoom.y}`
  );
  const [status, setStatus] = useState({ type: '', message: '' });

  // Helper pour afficher un message de statut
  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  // Sauvegarder les paramètres
  const handleSave = () => {
    const [x, y] = selectedRoom.split(',').map(Number);
    setDefaultRoom({ x, y });

    const room = roomConfig.find(r => r.x === x && r.y === y);
    showStatus('success', `✅ Pièce de démarrage définie : ${room.name}`);

    // Fermer la modale après un court délai
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // Handler pour le changement de sélection
  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚙️ Paramètres">
      <SettingsContainer>
        <SettingsSection>
          <SettingsTitle>Pièce de démarrage</SettingsTitle>
          <SettingsDescription>
            Choisissez la pièce dans laquelle l'application démarrera
          </SettingsDescription>

          <InputGroup>
            <Label htmlFor="defaultRoom">Pièce par défaut :</Label>
            <Select
              id="defaultRoom"
              value={selectedRoom}
              onChange={handleRoomChange}
            >
              {roomConfig.map(room => (
                <option key={`${room.x},${room.y}`} value={`${room.x},${room.y}`}>
                  {room.name}
                </option>
              ))}
            </Select>
          </InputGroup>

          <SaveButton onClick={handleSave}>
            Sauvegarder
          </SaveButton>

          {status.message && (
            <StatusMessage type={status.type}>
              {status.message}
            </StatusMessage>
          )}
        </SettingsSection>
      </SettingsContainer>
    </Modal>
  );
};

export default SettingsModal;