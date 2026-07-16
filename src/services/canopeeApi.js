/**
 * canopee-api client — la porte JSON lecture seule des registres de la Canopée.
 *
 * Backend : mcp.irimwebforge.com/canopee-api (b702, spike v0). Auth par header
 * X-Canopee-Token. Lecture seule stricte : scenes / agents / mandats / health.
 *
 * Config (variables d'env Vercel / .env.local) :
 *   VITE_CANOPEE_API    ex. https://mcp.irimwebforge.com/canopee-api
 *   VITE_CANOPEE_TOKEN  le token statique
 *
 * Remplace feu vault-api (service disparu) qui servait le portail des sages.
 */

const BASE = import.meta.env.VITE_CANOPEE_API || "";
const TOKEN = import.meta.env.VITE_CANOPEE_TOKEN || "";

export const isConfigured = () => Boolean(BASE && TOKEN);

async function get(path) {
  if (!isConfigured()) {
    throw new Error(
      "canopee-api non configurée — définir VITE_CANOPEE_API et " +
        "VITE_CANOPEE_TOKEN (env Vercel ou .env.local)."
    );
  }
  const res = await fetch(`${BASE}${path}`, {
    headers: { "X-Canopee-Token": TOKEN },
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(
      `canopee-api ${path} → HTTP ${res.status}` +
        (detail.detail ? ` : ${detail.detail}` : "")
    );
  }
  return res.json();
}

/** Les 12 scènes, telles que le registre les porte. */
export const fetchScenes = () => get("/scenes");

/** Les 60 fiches d'agents (projection v0). */
export const fetchAgents = () => get("/agents");

/** Le registre des mandats (par_agent + par_scène). */
export const fetchMandats = () => get("/mandats");

/** Santé + fraîcheur des registres. */
export const fetchHealth = () => get("/health");
