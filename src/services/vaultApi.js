/**
 * Vault 8sages API Client
 *
 * Calls REST wrapper on VPS (https://mcp.irimwebforge.com/vault-api)
 * Provides simple methods for vault operations
 *
 * SCOPE: Read notes, create notes, list files
 * NO direct MCP calls - all via wrapper
 */

const VAULT_API_URL = 'https://mcp.irimwebforge.com/vault-api';

/**
 * Read a note from vault
 * @param {string} path - File path (e.g., "1-knowledge-base/questions/...")
 * @returns {Promise<{success: boolean, content: string}>}
 */
export const readNote = async (path) => {
  try {
    const response = await fetch(
      `${VAULT_API_URL}/read-note?vault=8sages&path=${encodeURIComponent(path)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to read note');
    }

    // Extract text from MCP response structure
    // MCP returns: { content: { content: [{ type: "text", text: "..." }] } }
    if (data.content?.content?.[0]?.text) {
      return data.content.content[0].text;
    }

    // Fallback for plain text responses
    return data.content;
  } catch (error) {
    console.error('[VaultAPI] Error reading note:', error);
    throw error;
  }
};

/**
 * Create a note in vault
 * @param {string} path - File path (e.g., "_inboxes/handoffs/...")
 * @param {string} content - File content
 * @returns {Promise<{success: boolean, path: string}>}
 */
export const createNote = async (path, content) => {
  try {
    const response = await fetch(`${VAULT_API_URL}/create-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vault: '8sages',
        path,
        content
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create note');
    }

    return data;
  } catch (error) {
    console.error('[VaultAPI] Error creating note:', error);
    throw error;
  }
};

/**
 * Replace/update a note in vault
 * @param {string} path - File path
 * @param {string} content - Updated content
 * @returns {Promise<{success: boolean, path: string}>}
 */
export const replaceNote = async (path, content) => {
  try {
    const response = await fetch(`${VAULT_API_URL}/replace-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vault: '8sages',
        path,
        content
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to replace note');
    }

    return data;
  } catch (error) {
    console.error('[VaultAPI] Error replacing note:', error);
    throw error;
  }
};

/**
 * List all files in vault
 * @returns {Promise<{success: boolean, files: Array}>}
 */
export const listFiles = async () => {
  try {
    const response = await fetch(`${VAULT_API_URL}/list-files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vault: '8sages' })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to list files');
    }

    return data.files || [];
  } catch (error) {
    console.error('[VaultAPI] Error listing files:', error);
    throw error;
  }
};

/**
 * Check API health
 * @returns {Promise<{status: string, mcp_connected: boolean}>}
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${VAULT_API_URL}/health`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[VaultAPI] Health check failed:', error);
    throw error;
  }
};

export default {
  readNote,
  createNote,
  replaceNote,
  listFiles,
  checkHealth
};
