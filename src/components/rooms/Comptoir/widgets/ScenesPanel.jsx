// src/components/rooms/Comptoir/widgets/ScenesPanel.jsx
//
// La carte vivante des 12 scènes de la Canopée, lue depuis canopee-api.
// Remplace le portail des sages/questions (feu vault-api). Groupé par strate ;
// chaque scène montre son emoji, son sage, son territoire d'écriture, et le
// nombre de mandats actifs qui s'y jouent (vue par_scène du registre).

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  fetchScenes,
  fetchMandats,
  isConfigured,
} from "../../../../services/canopeeApi";

// Strates dans l'ordre du monde, vu du ciel.
const TIERS = [
  { key: "glade", label: "Clairières", hint: "on y façonne" },
  { key: "river", label: "Rivières", hint: "ça coule et dépose" },
  { key: "source", label: "Sources", hint: "on s'y abreuve" },
  { key: "lodge", label: "Loge", hint: "on y tient le monde" },
];

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 4px 2px;
`;

const TierBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TierHead = styled.h3`
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme?.colors?.textMuted || "#9bb5a4"};
  display: flex;
  align-items: baseline;
  gap: 8px;
  span {
    font-size: 0.68rem;
    text-transform: none;
    letter-spacing: 0;
    opacity: 0.7;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
`;

const Card = styled.article`
  border: 1px solid ${({ theme }) => theme?.colors?.border || "rgba(255,255,255,0.12)"};
  border-radius: 8px;
  padding: 10px 12px;
  background: ${({ theme }) => theme?.colors?.surface || "rgba(255,255,255,0.03)"};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CardHead = styled.header`
  display: flex;
  align-items: center;
  gap: 8px;
  .emoji {
    font-size: 1.25rem;
    line-height: 1;
  }
  .nom {
    font-weight: 600;
  }
  .mandats {
    margin-left: auto;
    font-size: 0.72rem;
    padding: 1px 7px;
    border-radius: 10px;
    background: ${({ theme }) => theme?.colors?.accent || "#2a6b4e"};
    color: #fff;
  }
`;

const Essence = styled.p`
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.35;
  opacity: 0.85;
`;

const Meta = styled.div`
  font-size: 0.72rem;
  opacity: 0.7;
  display: flex;
  flex-direction: column;
  gap: 2px;
  code {
    font-size: 0.7rem;
    opacity: 0.9;
  }
`;

const Notice = styled.div`
  padding: 14px;
  font-size: 0.85rem;
  line-height: 1.4;
  opacity: 0.85;
  code {
    background: rgba(255, 255, 255, 0.08);
    padding: 1px 5px;
    border-radius: 4px;
  }
`;

const ScenesPanel = () => {
  const [scenes, setScenes] = useState(null);
  const [mandats, setMandats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (!isConfigured()) {
      setLoading(false);
      return;
    }
    Promise.all([fetchScenes(), fetchMandats()])
      .then(([s, m]) => {
        if (!alive) return;
        setScenes(s.scenes || {});
        setMandats(m || {});
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (!isConfigured()) {
    return (
      <Notice>
        La porte <strong>canopee-api</strong> n'est pas configurée. Définir{" "}
        <code>VITE_CANOPEE_API</code> et <code>VITE_CANOPEE_TOKEN</code> dans les
        variables d'environnement (Vercel ou <code>.env.local</code>), puis
        redéployer.
      </Notice>
    );
  }
  if (loading) return <Notice>Lecture des registres…</Notice>;
  if (error) return <Notice>⚠️ {error}</Notice>;
  if (!scenes) return <Notice>Aucune scène servie.</Notice>;

  const mandatsCount = (slug) =>
    mandats?.par_scène?.[slug]?.mandats_couverts?.length || 0;

  return (
    <Wrap>
      {TIERS.map(({ key, label, hint }) => {
        const entries = Object.entries(scenes).filter(
          ([, s]) => s.tier === key
        );
        if (!entries.length) return null;
        return (
          <TierBlock key={key}>
            <TierHead>
              {label} <span>— {hint}</span>
            </TierHead>
            <Grid>
              {entries.map(([slug, s]) => {
                const n = mandatsCount(slug);
                return (
                  <Card key={slug}>
                    <CardHead>
                      <span className="emoji">{s.emoji}</span>
                      <span className="nom">{s.nom}</span>
                      {n > 0 && (
                        <span
                          className="mandats"
                          title={`${n} mandat${n > 1 ? "s" : ""} actif${
                            n > 1 ? "s" : ""
                          }`}
                        >
                          {n}
                        </span>
                      )}
                    </CardHead>
                    {s.essence && <Essence>{s.essence}</Essence>}
                    <Meta>
                      <div>
                        Sage :{" "}
                        {s.sage_primordial || <em>invitation (sans sage)</em>}
                      </div>
                      {Array.isArray(s.territoire) && s.territoire.length > 0 ? (
                        <div>
                          Territoire : <code>{s.territoire.join(" · ")}</code>
                        </div>
                      ) : (
                        <div>Territoire : — (tout passe par les mandats)</div>
                      )}
                    </Meta>
                  </Card>
                );
              })}
            </Grid>
          </TierBlock>
        );
      })}
    </Wrap>
  );
};

export default ScenesPanel;
