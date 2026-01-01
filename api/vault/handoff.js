/**
 * API Endpoint: POST /api/vault/handoff
 * Creates a handoff and stores it in Gist (encrypted AES-256)
 *
 * Body:
 * {
 *   filename: string (e.g., "chrysalis-vers-meridian-2026-01-01.md")
 *   content: string (markdown frontmatter + body)
 *   metadata: object (emetteur, recepteur, question, createdAt, source)
 * }
 *
 * Returns:
 * { success: true, filename: string, storedAt: string, encrypted: true, ... }
 * or
 * { success: false, error: string, code: string }
 *
 * M3 Implementation - Uses HandoffManager service
 */

// Dynamic import for serverless environment
let HandoffManager = null;

async function getHandoffManager() {
  if (!HandoffManager) {
    const module = await import('../../src/services/HandoffManager.js');
    HandoffManager = module.default;
  }
  return HandoffManager;
}

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const { filename, content, metadata } = req.body;

    // Validate required fields
    if (!filename || !content) {
      return res.status(400).json({
        error: 'Missing required fields: filename, content',
        code: 'INVALID_REQUEST'
      });
    }

    // Validate filename format (safety check)
    if (!/^[a-z0-9\-]+\.md$/.test(filename)) {
      return res.status(400).json({
        error: 'Invalid filename format',
        code: 'INVALID_FILENAME'
      });
    }

    // Extract metadata
    const { emetteur, recepteur, question, createdAt, source } = metadata || {};

    if (!emetteur || !recepteur || !question) {
      return res.status(400).json({
        error: 'Missing metadata: emetteur, recepteur, question required',
        code: 'INVALID_METADATA'
      });
    }

    // Get environment variables
    const githubToken = process.env.VITE_GITHUB_TOKEN;
    const gistId = process.env.VITE_SYNC_GIST_ID;
    const syncPassword = process.env.VITE_SYNC_PASSWORD;

    if (!githubToken || !syncPassword) {
      console.error('[HANDOFF] Missing environment variables');
      return res.status(500).json({
        error: 'Server misconfiguration: missing GitHub credentials',
        code: 'CONFIG_ERROR'
      });
    }

    // Get HandoffManager and configure it
    const manager = await getHandoffManager();
    manager.configure(githubToken, gistId, syncPassword);

    // Create handoff via manager
    const result = await manager.createHandoff(
      emetteur,
      recepteur,
      question,
      '' // contexte - pas utilisé depuis le endpoint
    );

    // Log creation
    console.log('[HANDOFF] Created successfully:', {
      filename: result.filename,
      emetteur,
      recepteur,
      timestamp: new Date().toISOString(),
      source
    });

    // Return success response
    return res.status(200).json({
      success: true,
      filename: result.filename,
      id: result.handoff.id,
      storedAt: '/vault/_inboxes/handoffs/',
      timestamp: result.handoff.date,
      encrypted: true,
      algorithm: 'AES-256-GCM',
      message: result.message,
      totalHandoffs: result.totalHandoffs,
      note: 'Handoff stocké dans Gist chiffré avec AES-256-GCM (PBKDF2 key derivation)'
    });

  } catch (error) {
    console.error('[HANDOFF] Error creating handoff:', error);

    // Return error response
    return res.status(500).json({
      error: error.message || 'Internal server error',
      code: 'SERVER_ERROR',
      timestamp: new Date().toISOString()
    });
  }
}
