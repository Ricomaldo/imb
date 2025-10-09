// src/components/modals/SyncModal/SyncModal.jsx - Modale de sync ultra-simple

import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import Modal from '../../common/Modal/Modal';
import {
  SyncContainer,
  SyncSection,
  SyncTitle,
  SyncDescription,
  ButtonGroup,
  ActionButton,
  StatusMessage
} from './SyncModal.styles';

/**
 * SyncModal - Interface de synchronisation ultra-simple
 *
 * 2 boutons seulement:
 * - EXPORT: Collecter tous les stores → Chiffrer → Upload GitHub Gist
 * - IMPORT: Download GitHub Gist → Déchiffrer → Écraser localStorage → Reload
 *
 * Variables d'env requises:
 * - VITE_GITHUB_TOKEN
 * - VITE_ENCRYPTION_PASSWORD
 * - VITE_GIST_ID (optionnel)
 */
const SyncModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'success', 'error', 'info'

  // Vérifier les variables d'env
  const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
  const encryptionPassword = import.meta.env.VITE_SYNC_PASSWORD;
  const gistId = import.meta.env.VITE_SYNC_GIST_ID;

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
  };

  const collectAllStores = () => {
    const data = {
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      architecture: 'multi-store',
      stores: {}
    };

    try {
      // Notes Store
      const notesData = localStorage.getItem('irim-notes-store');
      if (notesData) {
        data.stores.notes = JSON.parse(notesData).state;
      }

      // Project Meta Store
      const metaData = localStorage.getItem('project-meta-store');
      if (metaData) {
        data.stores.projectMeta = JSON.parse(metaData).state;
      }

      // Diary Store
      const diaryData = localStorage.getItem('diary-storage');
      if (diaryData) {
        data.stores.diary = JSON.parse(diaryData).state;
      }

      // Preferences Store
      const preferencesData = localStorage.getItem('irim-preferences-store');
      if (preferencesData) {
        data.stores.preferences = JSON.parse(preferencesData).state;
      }

      // Project Data Stores (tous les project-data-*)
      data.stores.projectData = {};
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('project-data-')) {
          const projectId = key.replace('project-data-', '');
          const projectData = localStorage.getItem(key);
          if (projectData) {
            data.stores.projectData[projectId] = JSON.parse(projectData).state;
          }
        }
      });

      console.log('📊 Stores collectés:', {
        notes: !!data.stores.notes,
        projectMeta: !!data.stores.projectMeta,
        diary: !!data.stores.diary,
        preferences: !!data.stores.preferences,
        projectDataCount: Object.keys(data.stores.projectData).length
      });

      return data;
    } catch (error) {
      console.error('❌ Erreur collecte stores:', error);
      throw new Error('Erreur lors de la collecte des données');
    }
  };

  const encryptData = (data) => {
    if (!encryptionPassword) {
      throw new Error('VITE_SYNC_PASSWORD manquant');
    }

    try {
      const jsonString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, encryptionPassword).toString();

      console.log('🔑 Données chiffrées');
      return encrypted;
    } catch (error) {
      console.error('❌ Erreur chiffrement:', error);
      throw new Error('Erreur lors du chiffrement');
    }
  };

  const decryptData = (encryptedData) => {
    if (!encryptionPassword) {
      throw new Error('VITE_SYNC_PASSWORD manquant');
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionPassword);
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);

      if (!jsonString) {
        throw new Error('Mot de passe incorrect ou données corrompues');
      }

      const data = JSON.parse(jsonString);
      console.log('🔓 Données déchiffrées');
      return data;
    } catch (error) {
      console.error('❌ Erreur déchiffrement:', error);
      throw new Error('Erreur lors du déchiffrement');
    }
  };

  const uploadToGist = async (data) => {
    if (!githubToken) {
      throw new Error('VITE_GITHUB_TOKEN manquant');
    }

    const encryptedData = encryptData(data);

    const gistData = {
      description: 'IRIM MetaBrain Sync Data',
      public: false,
      files: {
        'irim-sync.json': {
          content: encryptedData
        }
      }
    };

    const url = gistId
      ? `https://api.github.com/gists/${gistId}`
      : 'https://api.github.com/gists';

    const method = gistId ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gistData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    console.log('📤 Upload réussi:', result.html_url);

    return {
      url: result.html_url,
      id: result.id
    };
  };

  const downloadFromGist = async () => {
    if (!githubToken) {
      throw new Error('VITE_GITHUB_TOKEN manquant');
    }

    if (!gistId) {
      throw new Error('VITE_SYNC_GIST_ID manquant pour l\'import');
    }

    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const gistData = await response.json();
    const content = gistData.files['irim-sync.json']?.content;

    if (!content) {
      throw new Error('Fichier irim-sync.json non trouvé dans le Gist');
    }

    console.log('📥 Download réussi');
    return decryptData(content);
  };

  const writeAllToLocalStorage = (data) => {
    try {
      const { stores } = data;

      // Notes Store
      if (stores.notes) {
        localStorage.setItem('irim-notes-store', JSON.stringify({
          state: stores.notes,
          version: 1
        }));
      }

      // Project Meta Store
      if (stores.projectMeta) {
        localStorage.setItem('project-meta-store', JSON.stringify({
          state: stores.projectMeta,
          version: 2
        }));
      }

      // Diary Store
      if (stores.diary) {
        localStorage.setItem('diary-storage', JSON.stringify({
          state: stores.diary,
          version: 1
        }));
      }

      // Preferences Store
      if (stores.preferences) {
        localStorage.setItem('irim-preferences-store', JSON.stringify({
          state: stores.preferences,
          version: 1
        }));
      }

      // Nettoyer les anciens project-data-*
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('project-data-')) {
          localStorage.removeItem(key);
        }
      });

      // Project Data Stores
      if (stores.projectData) {
        Object.entries(stores.projectData).forEach(([projectId, projectData]) => {
          localStorage.setItem(`project-data-${projectId}`, JSON.stringify({
            state: projectData,
            version: 1
          }));
        });
      }

      localStorage.setItem('last-sync', new Date().toISOString());

      console.log('💾 Toutes les données écrites dans localStorage');
    } catch (error) {
      console.error('❌ Erreur écriture localStorage:', error);
      throw new Error('Erreur lors de l\'écriture des données');
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    showMessage('Export en cours...', 'info');

    try {
      // 1. Collecter tous les stores
      showMessage('Collecte des données...', 'info');
      const data = collectAllStores();

      // 2. Upload vers GitHub Gist (avec chiffrement)
      showMessage('Upload vers GitHub...', 'info');
      const result = await uploadToGist(data);

      // 3. Succès
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
          // L'export a réussi quand même, on garde juste le message sans "copié"
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
      // 1. Download depuis GitHub Gist (avec déchiffrement)
      showMessage('Téléchargement depuis GitHub...', 'info');
      const data = await downloadFromGist();

      // 2. Écraser tout dans localStorage
      showMessage('Restauration des données...', 'info');
      writeAllToLocalStorage(data);

      // 3. Succès + reload
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

  const isConfigured = githubToken && encryptionPassword;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚡ Synchronisation">
      <SyncContainer>
        <SyncSection>
          <SyncTitle>🔄 Sync GitHub Gist</SyncTitle>
          <SyncDescription>
            Sauvegardez ou restaurez toutes vos données via GitHub Gist chiffré.
          </SyncDescription>

          {!isConfigured && (
            <StatusMessage type="error">
              ❌ Configuration manquante: Vérifiez VITE_GITHUB_TOKEN et VITE_SYNC_PASSWORD
            </StatusMessage>
          )}

          {isConfigured && (
            <>
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
                  disabled={isLoading || !gistId}
                  style={{ backgroundColor: '#27ae60' }}
                >
                  📥 IMPORT
                </ActionButton>
              </ButtonGroup>

              {!gistId && (
                <StatusMessage type="info">
                  💡 VITE_SYNC_GIST_ID non défini - Un nouveau Gist sera créé lors du premier export
                </StatusMessage>
              )}
            </>
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