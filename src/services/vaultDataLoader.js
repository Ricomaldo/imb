/**
 * Vault Data Loader - Dynamically load sage questions from vault
 * Reads from: 1-knowledge-base/index-sages/{sage}-questions.md
 * Parses markdown and frontmatter to extract question index
 */

import mcpVaultClient from './mcpVaultClient';

class VaultDataLoader {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Load questions for a specific sage
   * @param {string} sageId - Sage ID (e.g., "chrysalis")
   * @returns {Promise<Array>} Array of questions with metadata
   */
  async loadSageQuestions(sageId) {
    const cacheKey = `sage-${sageId}`;
    const cached = this.cache.get(cacheKey);

    // Return cached if fresh
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Initialize MCP if needed
      await mcpVaultClient.initialize();

      // Read sage index file from vault
      const indexPath = `1-knowledge-base/index-sages/${sageId}-questions.md`;
      const fileContent = await mcpVaultClient.readNote('8sages', indexPath);

      // Parse the markdown content
      const questions = this.parseQuestionsFromMarkdown(fileContent.content);

      // Cache the result
      this.cache.set(cacheKey, {
        data: questions,
        timestamp: Date.now()
      });

      return questions;
    } catch (error) {
      console.error(`[VaultDataLoader] Error loading ${sageId} questions:`, error);
      return [];
    }
  }

  /**
   * Parse markdown file and extract questions
   * Format:
   * ### [QID] Title - Description
   * - **Statut** : Status
   * - **Framework** : ✅/❌
   * - **Fichier** : `path/to/question.md`
   */
  parseQuestionsFromMarkdown(content) {
    const questions = [];

    // Regex to match question headers
    // ### [QID] Title - Description
    const questionRegex = /###\s+\[([A-Z0-9]+)\]\s+(.+?)\s*\n([\s\S]*?)(?=###|\Z)/g;

    let match;
    while ((match = questionRegex.exec(content)) !== null) {
      const questionId = match[1];
      const titleAndDescription = match[2];
      const questionBody = match[3];

      // Parse title and description
      const titleMatch = titleAndDescription.match(/^([^-]+)(?:\s*-\s*(.+))?$/);
      const title = titleMatch ? titleMatch[1].trim() : titleAndDescription;

      // Extract metadata from bullet points
      const statusMatch = questionBody.match(/\*\*Statut\*\*\s*:\s*([^\n]+)/);
      const fichierMatch = questionBody.match(/\*\*Fichier\*\*\s*:\s*`([^`]+)`/);

      const status = statusMatch ? statusMatch[1].trim() : 'unknown';
      const filepath = fichierMatch ? fichierMatch[1] : '';

      // Extract domain from filepath (e.g., "accompagnement-ia" from path)
      const domain = this.extractDomainFromPath(filepath);

      questions.push({
        id: questionId,
        title: title.trim(),
        domain,
        status,
        filepath,
        sagePath: filepath // Keep original for reference
      });
    }

    return questions;
  }

  /**
   * Extract domain code from file path
   * Example: "questions/domaines-v4/accompagnement-ia/ACC01-..." → "acc"
   */
  extractDomainFromPath(filepath) {
    const match = filepath.match(/domaines-v4\/([a-z\-]+)\//);
    if (!match) return 'unknown';

    const domainName = match[1];

    // Map domain names to codes
    const domainMap = {
      'accompagnement-ia': 'ACC',
      'constitution-regulation': 'CON',
      'identite-transformation': 'IDE',
      'paternite-famille': 'FAM',
      'patrimoine-transgenerationnel': 'PAT',
      'professionnel-creation': 'PRO',
      'relationnel-couple': 'REL',
      'spirituel-engagement': 'SPI'
    };

    return domainMap[domainName] || domainName.substring(0, 3).toUpperCase();
  }

  /**
   * Load all sages questions (for bulk operations)
   * @returns {Promise<Object>} Map of sageId → questions
   */
  async loadAllSagesQuestions() {
    const sageIds = [
      'atlas',
      'bodhi',
      'chrysalis',
      'eleo',
      'gouvernail',
      'luna',
      'meridian',
      'onyx',
      'selah'
    ];

    const results = {};

    for (const sageId of sageIds) {
      try {
        results[sageId] = await this.loadSageQuestions(sageId);
      } catch (error) {
        console.error(`[VaultDataLoader] Failed to load ${sageId}:`, error);
        results[sageId] = [];
      }
    }

    return results;
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(sageId = null) {
    if (sageId) {
      this.cache.delete(`sage-${sageId}`);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    const status = {};
    this.cache.forEach((value, key) => {
      const age = Date.now() - value.timestamp;
      status[key] = {
        items: value.data.length,
        age: `${Math.round(age / 1000)}s`,
        fresh: age < this.cacheTimeout
      };
    });
    return status;
  }
}

// Export singleton instance
export default new VaultDataLoader();
