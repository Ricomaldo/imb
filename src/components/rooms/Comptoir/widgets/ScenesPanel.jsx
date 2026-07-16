// src/components/rooms/Comptoir/widgets/ScenesPanel.jsx
//
// La carte des 12 scènes, groupées par strate. Surface lisible partagée
// (canopeeUi) — le Panel est en transparentContent, c'est cette surface qui
// porte le contraste. Badge = mandats actifs de la scène (vue par_scène).

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  fetchScenes,
  fetchMandats,
  isConfigured,
} from "../../../../services/canopeeApi";
import { Surface, SectionHead, Notice, Path } from "./canopeeUi";

const TIERS = [
  { key: "glade", label: "Clairières", hint: "on y façonne" },
  { key: "river", label: "Rivières", hint: "ça coule et dépose" },
  { key: "source", label: "Sources", hint: "on s'y abreuve" },
  { key: "lodge", label: "Loge", hint: "on y tient le monde" },
];

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
`;

const Card = styled.article`
  background: #fbf6e8;
  border: 1px solid #e2d4b4;
  border-radius: 6px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CardHead = styled.header`
  display: flex;
  align-items: center;
  gap: 8px;
  .emoji {
    font-size: 1.2rem;
  }
  .nom {
    font-weight: 700;
  }
  .badge {
    margin-left: auto;
    font-size: 0.72rem;
    padding: 1px 8px;
    border-radius: 10px;
    background: #b06a2c;
    color: #fff;
  }
`;

const Essence = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: #4a3b2a;
`;

const Meta = styled.div`
  font-size: 0.73rem;
  color: #6a533a;
  display: flex;
  flex-direction: column;
  gap: 3px;
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

  if (!isConfigured())
    return (
      <Notice>
        Porte <strong>canopee-api</strong> non configurée —{" "}
        <code>VITE_CANOPEE_API</code> / <code>VITE_CANOPEE_TOKEN</code>.
      </Notice>
    );
  if (loading) return <Notice>Lecture des scènes…</Notice>;
  if (error) return <Notice>⚠️ {error}</Notice>;
  if (!scenes) return <Notice>Aucune scène servie.</Notice>;

  const count = (slug) =>
    mandats?.par_scène?.[slug]?.mandats_couverts?.length || 0;

  return (
    <Surface>
      {TIERS.map(({ key, label, hint }) => {
        const entries = Object.entries(scenes).filter(([, s]) => s.tier === key);
        if (!entries.length) return null;
        return (
          <section key={key}>
            <SectionHead>
              {label} <span>— {hint}</span>
            </SectionHead>
            <Grid>
              {entries.map(([slug, s]) => {
                const n = count(slug);
                return (
                  <Card key={slug}>
                    <CardHead>
                      <span className="emoji">{s.emoji}</span>
                      <span className="nom">{s.nom}</span>
                      {n > 0 && (
                        <span
                          className="badge"
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
                      {Array.isArray(s.territoire) && s.territoire.length ? (
                        <div>
                          Territoire :{" "}
                          {s.territoire.map((p) => (
                            <Path key={p}>{p}</Path>
                          ))}
                        </div>
                      ) : (
                        <div>Territoire : — (tout passe par les mandats)</div>
                      )}
                    </Meta>
                  </Card>
                );
              })}
            </Grid>
          </section>
        );
      })}
    </Surface>
  );
};

export default ScenesPanel;
