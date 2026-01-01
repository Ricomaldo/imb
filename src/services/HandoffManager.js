/**
 * HandoffManager - Service to manage handoff creation and storage
 * Stores handoffs in a separate encrypted file in Gist
 *
 * Format:
 * {
 *   version: "1.0.0",
 *   handoffs: [
 *     { id, emetteur, recepteur, question, contexte, date, statut, priorite }
 *   ]
 * }
 */

import SyncManager from './SyncManager';

class HandoffManager {
  constructor() {
    this.syncManager = SyncManager;
    this.HANDOFF_FILE_KEY = '_handoffs'; // Clé dans Gist pour fichier handoffs
  }

  /**
   * Configure avec les credentials GitHub
   */
  configure(githubToken, gistId, password) {
    this.syncManager.configure(githubToken, gistId);
    this.syncManager.setPassword(password);
  }

  /**
   * Charge la liste actuelle des handoffs depuis Gist
   * @returns {Array} Liste des handoffs existants
   */
  async loadHandoffsList() {
    try {
      // Si Gist n'existe pas encore, retourner liste vide
      if (!this.syncManager.gistId) {
        console.warn('[HandoffManager] No Gist ID configured, returning empty list');
        return [];
      }

      const gistData = await this.syncManager.downloadGist(
        this.syncManager.gistId,
        true // encrypted
      );

      // Chercher le fichier _handoffs dans le Gist
      if (gistData && gistData.handoffs) {
        return gistData.handoffs.handoffs || [];
      }

      return [];
    } catch (error) {
      console.warn('[HandoffManager] Error loading handoffs list, returning empty:', error.message);
      return [];
    }
  }

  /**
   * Crée un nouveau handoff et le sauve
   * @param {string} emetteur - Sage émetteur (e.g., "chrysalis")
   * @param {string} recepteur - Sage récepteur (e.g., "meridian")
   * @param {string} question - Question/sujet
   * @param {string} contexte - Contexte optionnel
   * @returns {Object} Résultat de création { success, handoff, filename }
   */
  async createHandoff(emetteur, recepteur, question, contexte = '') {
    try {
      // 1. Charger list existante
      const currentList = await this.loadHandoffsList();

      // 2. Créer nouvel handoff
      const timestamp = new Date().toISOString();
      const id = `${emetteur}-vers-${recepteur}-${timestamp.split('T')[0]}`;

      const newHandoff = {
        id,
        emetteur,
        recepteur,
        question: question.trim(),
        contexte: contexte.trim(),
        date: timestamp,
        statut: 'pending',
        priorite: 'normale',
        source: 'IMB-Comptoir'
      };

      // 3. Ajouter à list
      const updatedList = [newHandoff, ...currentList];

      // 4. Préparer data pour upload
      const handoffData = {
        version: '1.0.0',
        lastUpdated: timestamp,
        count: updatedList.length,
        handoffs: updatedList
      };

      // 5. Uploader vers Gist
      const filename = `${emetteur}-vers-${recepteur}-${timestamp.split('T')[0]}.md`;
      await this.syncManager.uploadGist(
        { handoffs: handoffData },
        true // encrypted
      );

      return {
        success: true,
        handoff: newHandoff,
        filename,
        message: `Handoff créé et stocké (chiffré AES-256)`,
        totalHandoffs: updatedList.length
      };
    } catch (error) {
      console.error('[HandoffManager] Error creating handoff:', error);
      throw new Error(error.message || 'Failed to create handoff');
    }
  }

  /**
   * Récupère tous les handoffs d'un sage
   * @param {string} sageId - ID du sage
   * @param {string} role - 'emetteur' ou 'recepteur'
   * @returns {Array} Handoffs filtrés
   */
  async getHandoffsForSage(sageId, role = 'emetteur') {
    const list = await this.loadHandoffsList();
    return list.filter(h => h[role] === sageId);
  }

  /**
   * Mets à jour le statut d'un handoff
   * @param {string} handoffId - ID du handoff
   * @param {string} newStatus - Nouveau statut
   */
  async updateHandoffStatus(handoffId, newStatus) {
    try {
      const list = await this.loadHandoffsList();
      const updated = list.map(h =>
        h.id === handoffId ? { ...h, statut: newStatus } : h
      );

      const handoffData = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        count: updated.length,
        handoffs: updated
      };

      await this.syncManager.uploadGist(
        { handoffs: handoffData },
        true
      );

      return { success: true, handoff: updated.find(h => h.id === handoffId) };
    } catch (error) {
      console.error('[HandoffManager] Error updating handoff:', error);
      throw error;
    }
  }
}

// Export singleton
export default new HandoffManager();
