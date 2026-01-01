// src/services/SyncManager.js - Service de synchronisation multi-device avec GitHub Gist

import CryptoJS from 'crypto-js';
import { logger } from '../utils/logger';

/**
 * SyncManager - Service générique de synchronisation chiffrée
 *
 * Architecture:
 * - Indépendant des stores spécifiques
 * - Chiffrement/déchiffrement transparent
 * - Upload/download vers GitHub Gist
 *
 * Sécurité:
 * - AES-256 pour le chiffrement symétrique
 * - PBKDF2 avec 10000 iterations pour dériver la clé
 * - Salt aléatoire pour chaque chiffrement
 */
class SyncManager {
  constructor() {
    this.githubToken = null;
    this.gistId = null;
    this.password = null;
  }

  /**
   * Configure le service avec les credentials
   * @param {string} githubToken - Personal Access Token GitHub
   * @param {string} gistId - ID du Gist (optionnel, sera créé si absent)
   */
  configure(githubToken, gistId = null) {
    this.githubToken = githubToken;
    this.gistId = gistId;
  }

  /**
   * Définit le mot de passe pour le chiffrement
   * @param {string} password - Mot de passe utilisateur
   */
  setPassword(password) {
    this.password = password;
  }

  /**
   * Chiffre des données avec AES
   * @param {Object} data - Données à chiffrer
   * @param {string} password - Mot de passe
   * @returns {string} - Données chiffrées en base64
   */
  encrypt(data, password = this.password) {
    if (!password) {
      throw new Error('Password required for encryption');
    }

    try {
      // Convertir les données en JSON
      const jsonString = JSON.stringify(data);

      // Générer un salt aléatoire
      const salt = CryptoJS.lib.WordArray.random(128/8);

      // Dériver une clé avec PBKDF2 (10000 iterations)
      const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256/32,
        iterations: 10000
      });

      // Générer un IV aléatoire
      const iv = CryptoJS.lib.WordArray.random(128/8);

      // Chiffrer avec AES
      const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // Combiner salt + iv + encrypted pour stockage
      const combined = salt.toString() + iv.toString() + encrypted.toString();

      return combined;
    } catch (error) {
      logger.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Déchiffre des données avec AES
   * @param {string} encryptedData - Données chiffrées en base64
   * @param {string} password - Mot de passe
   * @returns {Object} - Données déchiffrées
   */
  decrypt(encryptedData, password = this.password) {
    if (!password) {
      throw new Error('Password required for decryption');
    }

    try {
      // Extraire salt, iv et données chiffrées
      const salt = CryptoJS.enc.Hex.parse(encryptedData.substr(0, 32));
      const iv = CryptoJS.enc.Hex.parse(encryptedData.substr(32, 32));
      const encrypted = encryptedData.substring(64);

      // Dériver la clé avec le même salt
      const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256/32,
        iterations: 10000
      });

      // Déchiffrer
      const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // Convertir en string puis parser le JSON
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(jsonString);
    } catch (error) {
      logger.error('Decryption error:', error);
      throw new Error('Failed to decrypt data - wrong password?');
    }
  }

  /**
   * Upload des données vers GitHub Gist
   * @param {Object} data - Données à uploader
   * @param {boolean} encrypted - Si true, chiffre avant upload
   * @returns {Promise<string>} - URL du Gist
   */
  async uploadGist(data, encrypted = true) {
    if (!this.githubToken) {
      throw new Error('GitHub token not configured');
    }

    const timestamp = new Date().toISOString();

    // Si les données ont déjà un format complet (avec version, architecture, etc), les utiliser directement
    // Sinon, les wrapper dans l'ancien format legacy pour compatibilité descendante
    const storeData = data.version && data.architecture ? data : {
      version: '1.0.0',
      timestamp,
      stores: data
    };

    // Chiffrer si demandé
    const content = encrypted && this.password
      ? this.encrypt(storeData)
      : JSON.stringify(storeData, null, 2);

    const gistData = {
      description: 'IRIM StudioHall Sync Data',
      public: false,
      files: {
        'irim-sync.json': {
          content
        }
      }
    };

    try {
      const url = this.gistId
        ? `https://api.github.com/gists/${this.gistId}`
        : 'https://api.github.com/gists';

      const method = this.gistId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${this.githubToken}`,
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

      // Sauvegarder l'ID du Gist pour les futures updates
      if (!this.gistId) {
        this.gistId = result.id;
      }

      return result.html_url;
    } catch (error) {
      logger.error('Upload error:', error);
      throw new Error(`Failed to upload to GitHub: ${error.message}`);
    }
  }

  /**
   * Download des données depuis GitHub Gist
   * @param {string} gistId - ID du Gist (optionnel si déjà configuré)
   * @param {boolean} encrypted - Si true, déchiffre après download
   * @returns {Promise<Object>} - Données téléchargées
   */
  async downloadGist(gistId = this.gistId, encrypted = true) {
    if (!this.githubToken) {
      throw new Error('GitHub token not configured');
    }

    if (!gistId) {
      throw new Error('Gist ID required for download');
    }

    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'IRIM-MetaBrain/1.0',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const gistData = await response.json();

      // Debug: Lister tous les fichiers disponibles
      const availableFiles = Object.keys(gistData.files || {});
      logger.debug('🔍 Debug: Fichiers trouvés dans le Gist:', availableFiles);

      // Essayer différents noms de fichiers possibles
      let content = gistData.files['irim-sync.json']?.content;
      if (!content) {
        content = gistData.files['irim-metabrain-backup.json']?.content;
      }
      if (!content) {
        content = gistData.files['irim-backup.json']?.content;
      }

      if (!content) {
        throw new Error(`Sync file not found in Gist. Available files: ${availableFiles.join(', ')}`);
      }

      logger.debug('✅ Fichier trouvé et contenu récupéré');
      logger.debug('🔍 Debug: Taille du contenu:', content.length);
      logger.debug('🔍 Debug: Débuts du contenu:', content.substring(0, 100));

      // Déchiffrer si nécessaire
      if (encrypted && this.password) {
        try {
          logger.debug('🔑 Tentative de déchiffrement...');
          const result = this.decrypt(content);
          logger.debug('✅ Déchiffrement réussi');
          return result;
        } catch (error) {
          logger.error('❌ Erreur déchiffrement:', error);

          // Essayer de parser directement en cas d'échec (peut-être pas chiffré)
          try {
            logger.debug('🔄 Tentative de parsing direct (non chiffré)...');
            const directResult = JSON.parse(content);
            logger.debug('✅ Parsing direct réussi - données non chiffrées');
            return directResult;
          } catch (parseError) {
            logger.error('❌ Parsing direct échoué aussi:', parseError);
            throw error; // Relancer l'erreur originale de déchiffrement
          }
        }
      } else {
        return JSON.parse(content);
      }
    } catch (error) {
      logger.error('Download error:', error);
      throw new Error(`Failed to download from GitHub: ${error.message}`);
    }
  }

  /**
   * Teste la connexion GitHub
   * @returns {Promise<boolean>} - True si la connexion est OK
   */
  async testConnection() {
    if (!this.githubToken) {
      return false;
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      return response.ok;
    } catch (error) {
      logger.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Liste les Gists de l'utilisateur
   * @returns {Promise<Array>} - Liste des Gists
   */
  async listGists() {
    if (!this.githubToken) {
      throw new Error('GitHub token not configured');
    }

    try {
      const response = await fetch('https://api.github.com/gists', {
        headers: {
          'Authorization': `Bearer ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const gists = await response.json();
      // Filtrer pour ne garder que les gists IRIM
      return gists.filter(gist =>
        gist.description?.includes('IRIM') ||
        gist.files['irim-sync.json']
      );
    } catch (error) {
      logger.error('List gists error:', error);
      throw new Error(`Failed to list gists: ${error.message}`);
    }
  }
}

// Export une instance singleton
export default new SyncManager();