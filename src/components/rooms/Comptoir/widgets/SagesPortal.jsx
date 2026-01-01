import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import sagesData from '../../../../data/sagesConfig.json';
import useSagesStore from '../../../../stores/useSagesStore';
import { SageQuote } from './SageQuote';
import { SagesKnowledge } from './SagesKnowledge';
import { HandoffCreator } from './HandoffCreator';

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
  border: 3px solid ${props => props.color};
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: transform 0.2s;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    margin: 0;
    font-size: 0.95em;
    font-weight: 600;
    min-width: 0;
    word-break: break-word;
  }

  p {
    margin: 0;
    font-size: 0.75em;
    opacity: 0.8;
  }

  div:first-child {
    font-size: 2.5em;
    line-height: 1;
  }
`;

const MetaButton = styled.button`
  background: linear-gradient(135deg, ${props => props.color}33, ${props => props.color}66);
  border: 2px solid ${props => props.color};
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
    background: linear-gradient(135deg, ${props => props.color}66, ${props => props.color}99);
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
  border: 3px solid ${props => props.color};
  border-radius: 12px;
  padding: 30px;
  max-width: 400px;
  text-align: center;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

  h3 {
    font-size: 1.8em;
    margin: 10px 0;
  }

  p {
    margin: 15px 0;
    opacity: 0.9;
    line-height: 1.6;
  }

  button {
    background: ${props => props.color};
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

export const SagesPortal = () => {
  const [selectedSage, setSelectedSage] = useState(null);
  const { selectSage, addHistory } = useSagesStore();

  // Séparer les 8 sages du cercle et Gouvernail (méta)
  const circleSages = sagesData.sages.filter(s => !s.isMeta);
  const gouvernail = sagesData.sages.find(s => s.isMeta);

  const handleSageClick = (sage) => {
    setSelectedSage(sage);
    selectSage(sage.id);
    addHistory(sage.id);
  };

  return (
    <>
      <h2 style={{ padding: '20px', textAlign: 'center' }}>Portail des 8 Sages</h2>

      <SagesGrid>
        {circleSages.map(sage => (
          <Card
            key={sage.id}
            color={sage.color}
            onClick={() => handleSageClick(sage)}
          >
            <div>{sage.emoji}</div>
            <h3>{sage.name}</h3>
            <p>{sage.age} ans</p>
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

      {/* Modal avec Portal - évite clipping par overflow parent */}
      {selectedSage && createPortal(
        <ModalOverlay onClick={() => setSelectedSage(null)}>
          <ModalContent
            color={selectedSage.color}
            onClick={e => e.stopPropagation()}
          >
            <h3>{selectedSage.emoji} {selectedSage.name}</h3>
            <p>{selectedSage.specialty}</p>
            <p style={{ fontSize: '0.9em', opacity: '0.7' }}>{selectedSage.age} ans</p>
            {selectedSage.isMeta && (
              <p style={{ fontSize: '0.85em', opacity: '0.6', fontStyle: 'italic' }}>
                Coordinateur système
              </p>
            )}
            <SageQuote sageId={selectedSage.id} color={selectedSage.color} />
            <SagesKnowledge sageId={selectedSage.id} color={selectedSage.color} />
            <HandoffCreator
              emetteurId={selectedSage.id}
              emetteurName={selectedSage.name}
              color={selectedSage.color}
            />
            <button onClick={() => setSelectedSage(null)}>Fermer</button>
          </ModalContent>
        </ModalOverlay>,
        document.body
      )}
    </>
  );
};
