/**
 * MCP Vault Client - Communicate with MCP HTTP server
 * Handles SSE connection and tool calls to vault operations
 *
 * Connection: https://mcp.irimwebforge.com/sse
 * Tools: create_note, replace_note, append_to_note, update_frontmatter
 */

class MCPVaultClient {
  constructor() {
    this.MCP_URL = "https://mcp.irimwebforge.com";
    this.eventSource = null;
    this.messageId = 0;
    this.pendingRequests = new Map();
    this.isConnected = false;
    this.initPromise = null;
  }

  /**
   * Initialize SSE connection and perform MCP handshake
   */
  async initialize() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        // Open SSE connection
        await this.connectSSE();

        // Send initialization message
        await this.sendInitialize();

        console.log("[MCP] ✅ Connected to vault");
        return true;
      } catch (error) {
        console.error("[MCP] ❌ Initialization failed:", error);
        this.initPromise = null;
        throw error;
      }
    })();

    return this.initPromise;
  }

  /**
   * Connect to SSE endpoint
   */
  async connectSSE() {
    return new Promise((resolve, reject) => {
      try {
        this.eventSource = new EventSource(`${this.MCP_URL}/sse`);

        this.eventSource.addEventListener("open", () => {
          console.log("[MCP] SSE connected");
          this.isConnected = true;
          resolve();
        });

        this.eventSource.addEventListener("message", (event) => {
          this.handleMessage(event.data);
        });

        this.eventSource.addEventListener("error", (error) => {
          console.error("[MCP] SSE error:", error);
          this.isConnected = false;
          reject(error);
        });

        // Timeout if connection doesn't open
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error("SSE connection timeout"));
          }
        }, 5000);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send initialization message to MCP server
   */
  async sendInitialize() {
    return new Promise((resolve, reject) => {
      const msgId = this.nextMessageId();

      const initMessage = {
        jsonrpc: "2.0",
        id: msgId,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: {
            name: "IMB",
            version: "1.0.0"
          }
        }
      };

      this.pendingRequests.set(msgId, {
        resolve,
        reject,
        timeout: setTimeout(() => {
          this.pendingRequests.delete(msgId);
          reject(new Error("Initialize timeout"));
        }, 5000)
      });

      this.postMessage(initMessage);
    });
  }

  /**
   * Call a tool on the MCP server
   * @param {string} toolName - Tool name (e.g., "create_note")
   * @param {object} arguments - Tool arguments
   * @returns {Promise<object>} Tool result
   */
  async callTool(toolName, toolArguments) {
    // Ensure connected
    if (!this.isConnected) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const msgId = this.nextMessageId();

      const toolCall = {
        jsonrpc: "2.0",
        id: msgId,
        method: "tools/call",
        params: {
          name: toolName,
          arguments: toolArguments
        }
      };

      this.pendingRequests.set(msgId, {
        resolve,
        reject,
        timeout: setTimeout(() => {
          this.pendingRequests.delete(msgId);
          reject(new Error(`Tool call timeout: ${toolName}`));
        }, 10000)
      });

      this.postMessage(toolCall);
    });
  }

  /**
   * Create a note in vault
   */
  async createNote(vault, path, content) {
    const result = await this.callTool("create_note", {
      vault,
      path,
      content
    });

    return result;
  }

  /**
   * Replace note content
   */
  async replaceNote(vault, path, content) {
    const result = await this.callTool("replace_note", {
      vault,
      path,
      content
    });

    return result;
  }

  /**
   * Append to note
   */
  async appendToNote(vault, path, content) {
    const result = await this.callTool("append_to_note", {
      vault,
      path,
      content
    });

    return result;
  }

  /**
   * Update note frontmatter
   */
  async updateFrontmatter(vault, path, fields) {
    const result = await this.callTool("update_frontmatter", {
      vault,
      path,
      fields
    });

    return result;
  }

  /**
   * Read a note from vault
   */
  async readNote(vault, path) {
    const result = await this.callTool("read_note", {
      vault,
      path
    });

    return result;
  }

  /**
   * List vault files
   */
  async listVaultFiles(vault) {
    const result = await this.callTool("list_vault_files", {
      vault
    });

    return result;
  }

  /**
   * Post message to MCP server
   */
  postMessage(message) {
    const payload = JSON.stringify(message);

    fetch(`${this.MCP_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: payload
    }).catch((error) => {
      console.error("[MCP] Failed to post message:", error);
    });
  }

  /**
   * Handle incoming message from SSE
   */
  handleMessage(data) {
    try {
      const message = JSON.parse(data);

      // Handle responses to our requests
      if (message.id && this.pendingRequests.has(message.id)) {
        const request = this.pendingRequests.get(message.id);
        clearTimeout(request.timeout);
        this.pendingRequests.delete(message.id);

        if (message.error) {
          request.reject(new Error(message.error.message || "MCP error"));
        } else {
          request.resolve(message.result);
        }
      }
    } catch (error) {
      console.error("[MCP] Failed to parse message:", error);
    }
  }

  /**
   * Generate next message ID
   */
  nextMessageId() {
    return ++this.messageId;
  }

  /**
   * Disconnect SSE
   */
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
    }
  }
}

// Export singleton instance
export default new MCPVaultClient();
