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
  SaveButton,
  TabContainer,
  TabButton,
  TabContent
} from './SettingsModal.styles';
import usePreferencesStore from '../../../stores/usePreferencesStore';
import { roomConfig } from '../../../utils/roomPositions';
import RoomLayoutEditor from './RoomLayoutEditor';

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
  const { defaultRoom, setDefaultRoom, customRoomLayout, setCustomRoomLayout } = usePreferencesStore();
  const [selectedRoom, setSelectedRoom] = useState(
    `${defaultRoom.x},${defaultRoom.y}`
  );
  const [status, setStatus] = useState({ type: '', message: '' });
  const [activeTab, setActiveTab] = useState('general');

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

  // Sauvegarder la disposition personnalisée
  const handleSaveLayout = (layout) => {
    setCustomRoomLayout(layout);
    showStatus('success', '✅ Disposition des pièces sauvegardée !');

    // Optionnel : recharger la page pour appliquer la nouvelle disposition
    setTimeout(() => {
      if (window.confirm('Voulez-vous recharger la page pour appliquer la nouvelle disposition ?')) {
        window.location.reload();
      }
    }, 1000);
  };

  // Handler pour le changement de sélection
  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚙️ Paramètres" variant="roomcanvas">
      <SettingsContainer>
        <TabContainer>
          <TabButton
            $active={activeTab === 'general'}
            onClick={() => setActiveTab('general')}
          >
            Général
          </TabButton>
          <TabButton
            $active={activeTab === 'layout'}
            onClick={() => setActiveTab('layout')}
          >
            Disposition des pièces
          </TabButton>
        </TabContainer>

        <TabContent>
          {activeTab === 'general' && (
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
            </SettingsSection>
          )}

          {activeTab === 'layout' && (
            <SettingsSection>
              <SettingsTitle>Disposition personnalisée</SettingsTitle>
              <SettingsDescription>
                Réorganisez les pièces selon vos préférences en mode puzzle
              </SettingsDescription>

              <RoomLayoutEditor
                onSave={handleSaveLayout}
                initialLayout={customRoomLayout}
              />
            </SettingsSection>
          )}

          {status.message && (
            <StatusMessage type={status.type}>
              {status.message}
            </StatusMessage>
          )}
        </TabContent>
      </SettingsContainer>
    </Modal>
  );
};

export default SettingsModal;