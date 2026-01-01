import React, { useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import sagesData from "../../../../data/sagesConfig.json";
import useSagesStore from "../../../../stores/useSagesStore";
import { SageQuote } from "./SageQuote";
import { SagesKnowledge } from "./SagesKnowledge";
import { HandoffCreator } from "./HandoffCreator";

const SagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const GovernailContainer = styled.div`
  padding: 0 20px 20px 20px;
  width: 100%;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 3px solid ${(props) => props.color};
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  opacity: 0.8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  /* Overlay sombre */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    transition: background 0.2s ease;
    pointer-events: none;
  }

  &:hover {
    opacity: 1;
    transform: scale(1.08);
    box-shadow: 0 0 16px ${(props) => props.color};
    z-index: 1;

    &::before {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  h3 {
    margin: 0;
    font-size: 0.95em;
    font-weight: 600;
    min-width: 0;
    word-break: break-word;
    position: relative;
    z-index: 1;
  }

  p {
    margin: 0;
    font-size: 0.75em;
    opacity: 0.8;
    position: relative;
    z-index: 1;
  }

  div:first-child {
    font-size: 2.5em;
    line-height: 1;
    position: relative;
    z-index: 1;
  }
`;

const MetaButton = styled.button`
  background: linear-gradient(
    135deg,
    ${(props) => props.color}33,
    ${(props) => props.color}66
  );
  border: 2px solid ${(props) => props.color};
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.2s;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 60px;
  width: 100%;

  &:hover {
    background: linear-gradient(
      135deg,
      ${(props) => props.color}66,
      ${(props) => props.color}99
    );
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  span:first-child {
    font-size: 1.5em;
    flex-shrink: 0;
  }

  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    height: 52px;
    font-size: 1em;
  }

  @media (max-width: 480px) {
    height: 48px;
    font-size: 0.9em;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #2a2a2a;
  border: 3px solid ${(props) => props.color};
  border-radius: 12px;
  max-height: 80vh;
  width: 90vw;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 90vh;
  }

  button {
    background: ${(props) => props.color};
    border: none;
    color: #fff;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 15px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const ModalHeader = styled.div`
  padding: 20px 30px;
  border-bottom: 1px solid ${(props) => props.color}44;
  text-align: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const ModalEmoji = styled.div`
  font-size: 2.5em;
  margin-bottom: 8px;
`;

const ModalTitle = styled.h3`
  font-size: 1.5em;
  margin: 0;
  margin-bottom: 4px;
`;

const ModalBody = styled.div`
  padding: 20px 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  flex: 1;
  overflow-y: auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 20px;
  }

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.color}66;
    border-radius: 3px;

    &:hover {
      background: ${(props) => props.color}99;
    }
  }
`;

const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ModalFooter = styled.div`
  padding: 20px 30px;
  border-top: 1px solid ${(props) => props.color}44;
  display: flex;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 16px 20px;
  }

  button {
    margin-top: 0;
    flex: 1;
  }
`;

export const SagesPortal = () => {
  const [selectedSage, setSelectedSage] = useState(null);
  const { selectSage, addHistory } = useSagesStore();

  // Séparer les 8 sages du cercle et Gouvernail (méta)
  const circleSages = sagesData.sages.filter((s) => !s.isMeta);
  const gouvernail = sagesData.sages.find((s) => s.isMeta);

  const handleSageClick = (sage) => {
    setSelectedSage(sage);
    selectSage(sage.id);
    addHistory(sage.id);
  };

  return (
    <>
      <h2 style={{ padding: "20px", textAlign: "center" }}>
        Portail des 8 Sages
      </h2>

      <SagesGrid>
        {circleSages.map((sage) => (
          <Card
            key={sage.id}
            color={sage.color}
            onClick={() => handleSageClick(sage)}
          >
            <div>{sage.emoji}</div>
            <h3>{sage.name}</h3>
          </Card>
        ))}
      </SagesGrid>

      {/* Gouvernail - Bouton pleine largeur en dessous */}
      {gouvernail && (
        <GovernailContainer>
          <MetaButton
            color={gouvernail.color}
            onClick={() => handleSageClick(gouvernail)}
          >
            <span>{gouvernail.emoji}</span>
            <div>
              <strong>{gouvernail.name}</strong> - Coordination
            </div>
          </MetaButton>
        </GovernailContainer>
      )}

      {/* Modal avec Portal - Header + 2 colonnes (Questions + Handoff) */}
      {selectedSage &&
        createPortal(
          <ModalOverlay onClick={() => setSelectedSage(null)}>
            <ModalContent
              color={selectedSage.color}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header: Info sage compacte */}
              <ModalHeader color={selectedSage.color}>
                <ModalEmoji>{selectedSage.emoji}</ModalEmoji>
                <ModalTitle>{selectedSage.name}</ModalTitle>
              </ModalHeader>

              {/* Body: 2 colonnes Questions + Handoff */}
              <ModalBody color={selectedSage.color}>
                {/* Colonne gauche: Quote + Questions */}
                <ModalSection>
                  <SageQuote
                    sageId={selectedSage.id}
                    color={selectedSage.color}
                  />
                  <SagesKnowledge
                    sageId={selectedSage.id}
                    color={selectedSage.color}
                  />
                </ModalSection>

                {/* Colonne droite: Handoff */}
                <ModalSection>
                  <HandoffCreator
                    emetteurId={selectedSage.id}
                    emetteurName={selectedSage.name}
                    color={selectedSage.color}
                  />
                </ModalSection>
              </ModalBody>

              {/* Footer: Close button */}
              <ModalFooter color={selectedSage.color}>
                <button onClick={() => setSelectedSage(null)}>Fermer</button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>,
          document.body
        )}
    </>
  );
};
