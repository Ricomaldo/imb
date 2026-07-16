// src/components/rooms/Comptoir/widgets/canopeeUi.js
//
// Briques visuelles partagées des vues canopee-api (Mandats, Scènes).
// Palette lisible et autonome — indépendante du thème « bois » des rooms,
// pour garantir le contraste des données (le Panel est passé en
// transparentContent, ces surfaces contrôlent le fond).

import styled from "styled-components";

// Surface lisible qui remplit le panneau et scrolle en interne.
export const Surface = styled.div`
  height: 100%;
  overflow-y: auto;
  background: #f4ecd8;
  color: #2b2118;
  border-radius: 6px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 0.86rem;
  line-height: 1.4;
`;

export const SectionHead = styled.h3`
  margin: 0 0 6px;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8a6d4a;
  display: flex;
  align-items: baseline;
  gap: 8px;
  border-bottom: 1px solid #d8c9a8;
  padding-bottom: 4px;
  span {
    font-size: 0.66rem;
    text-transform: none;
    letter-spacing: 0;
    color: #a8895f;
  }
`;

export const Notice = styled.div`
  padding: 16px;
  font-size: 0.88rem;
  line-height: 1.5;
  color: #4a3b2a;
  code {
    background: #e5d8ba;
    padding: 1px 6px;
    border-radius: 4px;
  }
`;

export const Path = styled.code`
  font-size: 0.78rem;
  background: #e8dcc0;
  color: #5a4632;
  padding: 1px 6px;
  border-radius: 4px;
  word-break: break-all;
`;

// Résout le périmètre d'un mandat pour l'affichage : liste explicite, ou
// héritage du territoire de la scène de l'agent (le registre brut n'annote
// pas l'héritage — on le calcule ici, comme read_mandats côté moteur).
export function resolvePerimetre(mandat, agentScene, scenesById) {
  if (Array.isArray(mandat.périmètre) && mandat.périmètre.length) {
    return { paths: mandat.périmètre, hérité: false };
  }
  if (typeof mandat.périmètre === "string" && mandat.périmètre) {
    return { paths: [mandat.périmètre], hérité: false };
  }
  const terr = scenesById?.[agentScene]?.territoire;
  if (Array.isArray(terr) && terr.length) {
    return { paths: terr, hérité: true };
  }
  return { paths: [], hérité: true };
}
