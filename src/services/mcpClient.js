/**
 * MCP Client - Simple write operation for handoff creation
 * M4: Creates handoff files in vault via API endpoint
 */

export const createHandoff = async (emetteur, recepteur, question, contexte = '') => {
  try {
    // Format filename: emetteur-vers-recepteur-timestamp.md
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `${emetteur}-vers-${recepteur}-${timestamp}.md`;

    // Build frontmatter + content
    const content = `---
type: handoff
de: ${emetteur}
vers: ${recepteur}
date: ${new Date().toISOString()}
statut: pending
priorite: normale
---

# Handoff ${emetteur} → ${recepteur}

## Question

${question}

## Contexte

${contexte || '[À compléter par émetteur]'}

## Notes Complémentaires

[Observations, insights, sensibilités particulières]

---

*Créé depuis IMB Comptoir*
`;

    // POST vers endpoint API
    const response = await fetch('/api/vault/handoff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename,
        content,
        metadata: {
          emetteur,
          recepteur,
          question,
          createdAt: new Date().toISOString(),
          source: 'IMB-Comptoir'
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Handoff creation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('MCP Error:', error);
    throw error;
  }
};

// Future: Anthropic API integration (Phase 2)
export const chatWithSage = async (sageId, message) => {
  // Placeholder for Phase 2
  // Will use Anthropic API with streaming
  throw new Error('Chat API not yet implemented (Phase 2)');
};
