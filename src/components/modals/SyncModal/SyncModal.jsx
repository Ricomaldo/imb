// src/components/modals/SyncModal/SyncModal.jsx - Modale de sync ultra-simple

import React, { useState } from 'react';
import Modal from '../../common/Modal/Modal';
import projectSyncAdapter from '../../../services/ProjectSyncAdapter';
import {
  SyncContainer,
  SyncSection,
  SyncTitle,
  SyncDescription,
  InputGroup,
  Label,
  PasswordInput,
  ButtonGroup,
  ActionButton,
  StatusMessage
} from './SyncModal.styles';

const PASSWORD_STORAGE_KEY = 'sync-encryption-password';

/**
 * SyncModal - Interface de synchronisation ultra-simple
 *
 * 2 boutons seulement:
 * - EXPORT: Collecter tous les stores → Chiffrer → Upload via /api/sync
 * - IMPORT: Download via /api/sync → Déchiffrer → Écraser localStorage → Reload
 *
 * Le token GitHub et l'identifiant du gist vivent côté serveur (Vercel).
 * Le mot de passe de chiffrement est saisi par l'utilisateur et persisté
 * en localStorage, par appareil.
 *
 * @renders Modal
 * @renders SyncContainer
 * @renders SyncSection
 * @renders SyncTitle
 * @renders SyncDescription
 * @renders ButtonGroup
 * @renders ActionButton
 * @renders StatusMessage - conditionally rendered when message or config errors
 */
const SyncModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'success', 'error', 'info'
  const [encryptionPassword, setEncryptionPassword] = useState(
    () => localStorage.getItem(PASSWORD_STORAGE_KEY) || ''
  );

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setEncryptionPassword(value);
    localStorage.setItem(PASSWORD_STORAGE_KEY, value);
  };

  /**
   * Configure le projectSyncAdapter avec le mot de passe de chiffrement
   */
  const configureSyncAdapter = () => {
    projectSyncAdapter.setPassword(encryptionPassword);
  };

  const handleExport = async () => {
    setIsLoading(true);
    showMessage('Export en cours...', 'info');

    try {
      // Configurer l'adapter avec les credentials
      configureSyncAdapter();

      // Export via projectSyncAdapter (même format PBKDF2 que auto-sync)
      showMessage('Collecte et chiffrement des données...', 'info');
      const result = await projectSyncAdapter.exportToGist(true);

      if (!result.success) {
        throw new Error(result.error || 'Export failed');
      }

      // Succès
      showMessage(`✅ Export réussi! Gist ID: ${result.id}`, 'success');

      // Copier l'ID dans le presse-papier (iOS peut bloquer)
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(result.id);
          setTimeout(() => {
            showMessage(`✅ Export réussi! Gist ID copié: ${result.id}`, 'success');
          }, 100);
        } catch (clipboardError) {
          console.warn('📋 Clipboard non disponible sur cet appareil:', clipboardError);
        }
      }

    } catch (error) {
      console.error('❌ Export failed:', error);
      showMessage(`❌ Erreur export: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    const confirmed = window.confirm(
      '⚠️ ATTENTION: L\'import va remplacer TOUTES vos données locales.\n\nContinuer ?'
    );

    if (!confirmed) return;

    setIsLoading(true);
    showMessage('Import en cours...', 'info');

    try {
      // Configurer l'adapter avec les credentials
      configureSyncAdapter();

      // Import via projectSyncAdapter (déchiffrement PBKDF2 compatible)
      showMessage('Téléchargement et déchiffrement...', 'info');
      const result = await projectSyncAdapter.importFromGist(null, true);

      if (!result.success) {
        throw new Error(result.error || 'Import failed');
      }

      // Succès + reload
      showMessage('✅ Import réussi! Rechargement de la page...', 'success');

      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('❌ Import failed:', error);
      showMessage(`❌ Erreur import: ${error.message}`, 'error');
      setIsLoading(false);
    }
  };

  const isConfigured = !!encryptionPassword;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚡ Synchronisation">
      <SyncContainer>
        <SyncSection>
          <SyncTitle>🔄 Sync GitHub Gist</SyncTitle>
          <SyncDescription>
            Sauvegardez ou restaurez toutes vos données via GitHub Gist chiffré.
          </SyncDescription>

          <InputGroup>
            <Label htmlFor="sync-encryption-password">Mot de passe de chiffrement</Label>
            <PasswordInput
              id="sync-encryption-password"
              type="password"
              value={encryptionPassword}
              onChange={handlePasswordChange}
              placeholder="Min 8 caractères"
              autoComplete="off"
            />
          </InputGroup>

          {!isConfigured && (
            <StatusMessage type="error">
              ❌ Saisissez un mot de passe de chiffrement pour activer la synchronisation
            </StatusMessage>
          )}

          {isConfigured && (
            <ButtonGroup>
              <ActionButton
                onClick={handleExport}
                disabled={isLoading}
                style={{ backgroundColor: '#e67e22' }}
              >
                📤 EXPORT
              </ActionButton>

              <ActionButton
                onClick={handleImport}
                disabled={isLoading}
                style={{ backgroundColor: '#27ae60' }}
              >
                📥 IMPORT
              </ActionButton>
            </ButtonGroup>
          )}

          {message && (
            <StatusMessage type={messageType}>
              {message}
            </StatusMessage>
          )}
        </SyncSection>
      </SyncContainer>
    </Modal>
  );
};

export default SyncModal;