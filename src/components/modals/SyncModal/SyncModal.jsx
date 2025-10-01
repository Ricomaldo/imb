// src/components/modals/SyncModal/SyncModal.jsx - Modal de synchronisation

import React, { useState } from 'react';
import Modal from '../../common/Modal/Modal';
import {
  SyncContainer,
  SyncSection,
  SyncTitle,
  SyncDescription,
  InputGroup,
  Label,
  Input,
  PasswordInput,
  ButtonGroup,
  ActionButton,
  StatusMessage,
  ConfigInfo,
  ConfigRow
} from './SyncModal.styles';
import ProjectSyncAdapter from '../../../services/ProjectSyncAdapter';
import useProjectMetaStore from '../../../stores/useProjectMetaStore';

/**
 * SyncModal - Interface de synchronisation des stores
 *
 * Fonctionnalités:
 * - Configuration GitHub token et mot de passe
 * - Export/Import des stores chiffrés
 * - Feedback visuel des opérations
 * - Gestion des erreurs
 *
 * @renders Modal
 * @renders SyncContainer
 * @renders SyncSection
 * @renders SyncTitle
 * @renders SyncDescription
 * @renders InputGroup
 * @renders Label
 * @renders Input
 * @renders PasswordInput
 * @renders ActionButton
 * @renders ButtonGroup
 * @renders StatusMessage
 * @renders ConfigInfo
 * @renders ConfigRow
 */
const SyncModal = ({ isOpen, onClose }) => {
  // Charger les credentials depuis .env si disponibles
  const envToken = import.meta.env.VITE_GITHUB_TOKEN || '';
  const envPassword = import.meta.env.VITE_SYNC_PASSWORD || '';
  const envGistId = import.meta.env.VITE_SYNC_GIST_ID || '';
  const hasEnvConfig = !!(envToken && envPassword);

  // États locaux pour l'UI
  const [githubToken, setGithubToken] = useState(envToken);
  const [password, setPassword] = useState(envPassword);
  const [gistId, setGistId] = useState(envGistId);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Stats de synchronisation
  const metaStore = useProjectMetaStore();
  const projectCount = Object.keys(metaStore.projects || {}).length;

  // Helper pour afficher un message de statut
  const showStatus = (type, message) => {
    setStatus({ type, message });
    // Auto-clear après 5 secondes
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  // Test de connexion GitHub
  const handleTestConnection = async () => {
    if (!githubToken) {
      showStatus('error', '⚠️ Token GitHub requis');
      return;
    }

    setIsLoading(true);
    try {
      ProjectSyncAdapter.configure(githubToken);
      const isConnected = await ProjectSyncAdapter.testConnection();

      if (isConnected) {
        showStatus('success', '✅ Connexion GitHub OK');
      } else {
        showStatus('error', '❌ Token invalide ou expiré');
      }
    } catch (error) {
      showStatus('error', `❌ Erreur: ${error.message}`);
    }
    setIsLoading(false);
  };

  // Export vers GitHub Gist
  const handleExport = async () => {
    if (!githubToken) {
      showStatus('error', '⚠️ Token GitHub requis');
      return;
    }

    if (!password || password.length < 8) {
      showStatus('error', '⚠️ Mot de passe requis (min 8 caractères)');
      return;
    }

    setIsLoading(true);
    try {
      // Configurer le service
      ProjectSyncAdapter.configure(githubToken, gistId);
      ProjectSyncAdapter.setPassword(password);

      // Export avec le nouvel adaptateur
      const result = await ProjectSyncAdapter.exportToGist(true);

      if (result.success) {
        // Sauvegarder l'ID du Gist pour futures mises à jour
        if (!gistId && result.id) {
          setGistId(result.id);
        }

        showStatus('success', `✅ Export réussi ! ${projectCount} projets synchronisés`);
        showStatus('info', `📋 Gist ID: ${result.id} (copié dans le presse-papier)`);
      } else {
        showStatus('error', `❌ Erreur export: ${result.error}`);
      }
    } catch (error) {
      showStatus('error', `❌ Erreur export: ${error.message}`);
    }
    setIsLoading(false);
  };

  // Import depuis GitHub Gist
  const handleImport = async () => {
    if (!githubToken) {
      showStatus('error', '⚠️ Token GitHub requis');
      return;
    }

    if (!gistId) {
      showStatus('error', '⚠️ ID du Gist requis');
      return;
    }

    if (!password) {
      showStatus('error', '⚠️ Mot de passe requis pour déchiffrer');
      return;
    }

    setIsLoading(true);
    try {
      // Configurer le service
      ProjectSyncAdapter.configure(githubToken, gistId);
      ProjectSyncAdapter.setPassword(password);

      // Confirmation avant d'écraser les données locales
      const confirm = window.confirm(
        `⚠️ Ceci va remplacer toutes vos données locales par celles du Gist.\n` +
        `Projets locaux: ${projectCount}\n` +
        `Continuer ?`
      );

      if (!confirm) {
        showStatus('info', 'Import annulé');
        setIsLoading(false);
        return;
      }

      // Import avec le nouvel adaptateur
      const result = await ProjectSyncAdapter.importFromGist(gistId, true);

      if (result.success) {
        showStatus('success', '✅ Import réussi ! Données synchronisées');
        if (result.migrated) {
          showStatus('info', '📦 Migration depuis l\'ancien format effectuée');
        }
        // Recharger la page pour appliquer les changements
        setTimeout(() => window.location.reload(), 2000);
      } else {
        showStatus('error', `❌ Erreur import: ${result.error}`);
      }
    } catch (error) {
      showStatus('error', `❌ Erreur import: ${error.message}`);
    }
    setIsLoading(false);
  };

  // Liste des Gists existants
  const handleListGists = async () => {
    if (!githubToken) {
      showStatus('error', '⚠️ Token GitHub requis');
      return;
    }

    setIsLoading(true);
    try {
      ProjectSyncAdapter.configure(githubToken);
      const gists = await ProjectSyncAdapter.listGists();

      if (gists.length === 0) {
        showStatus('info', 'Aucun Gist IRIM trouvé');
      } else {
        const gistInfo = gists.map(g => `${g.id} (${g.updated_at})`).join('\n');
        showStatus('info', `Gists trouvés:\n${gistInfo}`);

        // Auto-remplir avec le premier Gist trouvé
        if (gists[0]) {
          setGistId(gists[0].id);
        }
      }
    } catch (error) {
      showStatus('error', `❌ Erreur: ${error.message}`);
    }
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🔄 Synchronisation"
      size="large"
      variant="overlay"
      showCloseButton={true}
    >
      <SyncContainer>
        {/* Section Configuration */}
        <SyncSection>
          <SyncTitle>⚙️ Configuration</SyncTitle>
          <SyncDescription>
            Synchronisez vos données entre appareils via GitHub Gist chiffré
            {hasEnvConfig && <div style={{ color: '#4A9D4A', marginTop: '8px', fontSize: '13px' }}>
              ✅ Configuration chargée depuis .env.local
            </div>}
          </SyncDescription>

          <InputGroup>
            <Label>GitHub Personal Access Token</Label>
            <Input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder={hasEnvConfig ? "••••••••••••••••••••" : "ghp_xxxxxxxxxxxxxxxxxxxx"}
              disabled={isLoading || !!envToken}
            />
            <ActionButton onClick={handleTestConnection} disabled={isLoading}>
              🔗 Tester connexion
            </ActionButton>
          </InputGroup>

          <InputGroup>
            <Label>Mot de passe de chiffrement (min 8 caractères)</Label>
            <PasswordInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={hasEnvConfig ? "••••••••••••••••••••" : "Mot de passe fort pour chiffrer vos données"}
              disabled={isLoading || !!envPassword}
            />
          </InputGroup>

          <InputGroup>
            <Label>ID du Gist (optionnel pour export, requis pour import)</Label>
            <Input
              type="text"
              value={gistId}
              onChange={(e) => setGistId(e.target.value)}
              placeholder={envGistId || "Ex: abc123def456..."}
              disabled={isLoading}
            />
            <ActionButton onClick={handleListGists} disabled={isLoading}>
              📋 Lister mes Gists
            </ActionButton>
          </InputGroup>
        </SyncSection>

        {/* Section Actions */}
        <SyncSection>
          <SyncTitle>🚀 Actions</SyncTitle>

          <ButtonGroup>
            <ActionButton
              $variant="primary"
              onClick={handleExport}
              disabled={isLoading || !githubToken || !password}
            >
              ⬆️ Exporter vers GitHub
            </ActionButton>

            <ActionButton
              $variant="secondary"
              onClick={handleImport}
              disabled={isLoading || !githubToken || !password || !gistId}
            >
              ⬇️ Importer depuis GitHub
            </ActionButton>
          </ButtonGroup>

          {/* Message de statut */}
          {status.message && (
            <StatusMessage $type={status.type}>
              {status.message}
            </StatusMessage>
          )}
        </SyncSection>

        {/* Section Info */}
        <SyncSection>
          <ConfigInfo>
            <ConfigRow>
              <strong>Sécurité:</strong> AES-256 + PBKDF2 (10k iterations)
            </ConfigRow>
            <ConfigRow>
              <strong>Données:</strong> Notes + Projets
            </ConfigRow>
            <ConfigRow>
              <strong>Stockage:</strong> GitHub Gist privé
            </ConfigRow>
          </ConfigInfo>
        </SyncSection>
      </SyncContainer>
    </Modal>
  );
};

export default SyncModal;