// api/sync.js — proxy serveur vers GitHub Gist : le token ne quitte jamais Vercel.
//
// GET  -> lit le gist configuré (SYNC_GIST_ID)
// POST -> crée le gist (si SYNC_GIST_ID absent) ou le met à jour (PATCH)
//
// Protégé par un secret partagé (X-Irim-Sync-Key vs VITE_SYNC_GATE_KEY) pour
// que la route ne soit pas un proxy ouvert vers le gist privé.

import { timingSafeEqual } from 'node:crypto';

const GITHUB_API = 'https://api.github.com';

function isAuthorized(req) {
  const expected = process.env.VITE_SYNC_GATE_KEY;
  const provided = req.headers['x-irim-sync-key'];

  if (!expected || !provided) return false;

  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(String(provided));

  return (
    expectedBuf.length === providedBuf.length &&
    timingSafeEqual(expectedBuf, providedBuf)
  );
}

async function forward(response, res) {
  const text = await response.text();
  res.status(response.status);
  res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
  res.send(text);
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const token = process.env.SYNC_GITHUB_TOKEN;
  const gistId = process.env.SYNC_GIST_ID;

  if (!token) {
    res.status(500).json({ error: 'SYNC_GITHUB_TOKEN not configured' });
    return;
  }

  if (req.method === 'GET') {
    if (!gistId) {
      res.status(500).json({ error: 'SYNC_GIST_ID not configured' });
      return;
    }

    const response = await fetch(`${GITHUB_API}/gists/${gistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'IRIM-MetaBrain-Sync-Proxy/1.0',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    await forward(response, res);
    return;
  }

  if (req.method === 'POST') {
    const url = gistId ? `${GITHUB_API}/gists/${gistId}` : `${GITHUB_API}/gists`;
    const method = gistId ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    await forward(response, res);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
