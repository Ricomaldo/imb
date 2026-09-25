#!/usr/bin/env node
// scripts/check-bundle-secrets.js - Casse le build si un secret de sync
// finit dans le bundle public (le cas qui a fait fuir le token 290 jours).
//
// Lancé en postbuild : lit dist/, cherche les patterns de secret ou les
// noms des variables serveur qui ne doivent jamais y apparaître.

import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');

const FORBIDDEN_PATTERNS = [
  { name: 'GitHub PAT (classic)', regex: /ghp_[A-Za-z0-9]{20,}/ },
  { name: 'GitHub PAT (fine-grained)', regex: /github_pat_[A-Za-z0-9_]{20,}/ },
  { name: 'nom de variable serveur SYNC_GITHUB_TOKEN', regex: /SYNC_GITHUB_TOKEN/ },
  { name: 'nom de variable serveur SYNC_GIST_ID', regex: /SYNC_GIST_ID/ }
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

if (!fs.existsSync(distDir)) {
  console.error(`❌ check-bundle-secrets: ${distDir} introuvable (build absent ?)`);
  process.exit(1);
}

const files = walk(distDir).filter((f) => /\.(js|html|css|json|map)$/.test(f));
const findings = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const { name, regex } of FORBIDDEN_PATTERNS) {
    const match = content.match(regex);
    if (match) {
      findings.push({ file: path.relative(process.cwd(), file), name, match: match[0] });
    }
  }
}

if (findings.length > 0) {
  console.error('❌ check-bundle-secrets: secret(s) trouvé(s) dans le bundle public !\n');
  for (const f of findings) {
    console.error(`  ${f.file} — ${f.name} (${f.match.slice(0, 12)}...)`);
  }
  console.error('\nLe build est cassé volontairement : ne pas déployer ce bundle.');
  process.exit(1);
}

console.log(`✅ check-bundle-secrets: ${files.length} fichiers passés au crible, rien trouvé.`);
