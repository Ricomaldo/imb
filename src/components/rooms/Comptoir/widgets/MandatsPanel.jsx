// src/components/rooms/Comptoir/widgets/MandatsPanel.jsx
//
// La vue vivante des mandats : qui porte quoi, maintenant. Croise
// /mandats (par_agent, source de vérité) avec /agents (maison, emoji) et
// /scenes (territoires, pour résoudre le périmètre hérité). C'est le cœur
// du dashboard — ce que la Canopée fait, pas seulement ce qu'elle est.

import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  fetchMandats,
  fetchAgents,
  fetchScenes,
  isConfigured,
} from "../../../../services/canopeeApi";
import {
  Surface,
  SectionHead,
  Notice,
  Path,
  resolvePerimetre,
} from "./canopeeUi";

const Row = styled.article`
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 9px 11px;
  background: #fbf6e8;
  border: 1px solid #e2d4b4;
  border-left: 3px solid ${({ $accent }) => $accent || "#8a6d4a"};
  border-radius: 6px;
`;

const Head = styled.header`
  display: flex;
  align-items: center;
  gap: 8px;
  .emoji {
    font-size: 1.05rem;
  }
  .agent {
    font-weight: 700;
  }
  .mission {
    color: #6a533a;
  }
  .depuis {
    margin-left: auto;
    font-size: 0.72rem;
    color: #a8895f;
    white-space: nowrap;
  }
`;

const Peri = styled.div`
  font-size: 0.76rem;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 6px;
  align-items: baseline;
  .lbl {
    color: #a8895f;
  }
  .herite {
    font-style: italic;
    color: #9a7d54;
  }
`;

const Summary = styled.div`
  font-size: 0.8rem;
  color: #6a533a;
  strong {
    color: #2b2118;
  }
`;

const Eligibles = styled.details`
  font-size: 0.8rem;
  color: #6a533a;
  summary {
    cursor: pointer;
    color: #8a6d4a;
    user-select: none;
  }
  ul {
    margin: 6px 0 0;
    padding-left: 18px;
  }
  li {
    margin: 2px 0;
  }
`;

const TIER_ACCENT = {
  glade: "#3f8a60",
  river: "#2f6f8f",
  source: "#7a5ea8",
  lodge: "#b06a2c",
};

const MandatsPanel = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (!isConfigured()) {
      setLoading(false);
      return;
    }
    Promise.all([fetchMandats(), fetchAgents(), fetchScenes()])
      .then(([m, a, s]) => {
        if (!alive) return;
        setData({ mandats: m, agents: a.agents || {}, scenes: s.scenes || {} });
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const model = useMemo(() => {
    if (!data) return null;
    const { mandats, agents, scenes } = data;
    const parAgent = mandats.par_agent || {};
    const actifs = [];
    const eligibles = [];
    for (const [slug, e] of Object.entries(parAgent)) {
      const agent = agents[slug] || {};
      const scene = agent["scène"];
      for (const m of e.actifs || []) {
        actifs.push({ slug, agent, scene, mandat: m });
      }
      for (const m of e.éligibles || []) {
        eligibles.push({ slug, agent, mission: m.mission });
      }
    }
    actifs.sort((x, y) =>
      (x.agent.nom || x.slug).localeCompare(y.agent.nom || y.slug)
    );
    return { actifs, eligibles, scenes };
  }, [data]);

  if (!isConfigured())
    return (
      <Notice>
        La porte <strong>canopee-api</strong> n'est pas configurée —{" "}
        <code>VITE_CANOPEE_API</code> / <code>VITE_CANOPEE_TOKEN</code>.
      </Notice>
    );
  if (loading) return <Notice>Lecture du registre des mandats…</Notice>;
  if (error) return <Notice>⚠️ {error}</Notice>;
  if (!model) return <Notice>Aucun mandat servi.</Notice>;

  const { actifs, eligibles, scenes } = model;
  const porteurs = new Set(actifs.map((a) => a.slug)).size;

  return (
    <Surface>
      <Summary>
        <strong>{actifs.length}</strong> mandat{actifs.length > 1 ? "s" : ""}{" "}
        actif{actifs.length > 1 ? "s" : ""}, porté
        {actifs.length > 1 ? "s" : ""} par <strong>{porteurs}</strong> agent
        {porteurs > 1 ? "s" : ""}.
      </Summary>

      <section>
        <SectionHead>
          Actifs <span>— ce qui se joue maintenant</span>
        </SectionHead>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {actifs.map(({ slug, agent, scene, mandat }, i) => {
            const { paths, hérité } = resolvePerimetre(mandat, scene, scenes);
            const accent = TIER_ACCENT[scenes[scene]?.tier];
            return (
              <Row key={`${slug}-${mandat.mission}-${i}`} $accent={accent}>
                <Head>
                  <span className="emoji">{agent.emoji || "•"}</span>
                  <span className="agent">{agent.nom || slug}</span>
                  <span className="mission">— {mandat.mission}</span>
                  {mandat.depuis && (
                    <span className="depuis">depuis {mandat.depuis}</span>
                  )}
                </Head>
                <Peri>
                  <span className="lbl">
                    {hérité ? "territoire (hérité) :" : "périmètre :"}
                  </span>
                  {paths.length ? (
                    paths.map((p) => <Path key={p}>{p}</Path>)
                  ) : (
                    <span className="herite">— non spatial</span>
                  )}
                  {scene && (
                    <span className="herite">
                      · maison {scenes[scene]?.emoji} {scene}
                    </span>
                  )}
                </Peri>
              </Row>
            );
          })}
          {!actifs.length && <Notice>Aucun mandat actif pour l'instant.</Notice>}
        </div>
      </section>

      {eligibles.length > 0 && (
        <Eligibles>
          <summary>
            {eligibles.length} éligible{eligibles.length > 1 ? "s" : ""} —
            capacités reconnues, rien d'engagé
          </summary>
          <ul>
            {eligibles.map((e, i) => (
              <li key={`${e.slug}-${i}`}>
                {e.agent.emoji} {e.agent.nom || e.slug} — {e.mission}
              </li>
            ))}
          </ul>
        </Eligibles>
      )}
    </Surface>
  );
};

export default MandatsPanel;
