import React from 'react';
import styled from 'styled-components';
import sagesConfig from '../../../../data/sagesConfig.json';

const SageSelectorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  box-sizing: border-box;
`;

const SageButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme, $active }) =>
    $active ? `${theme.colors.background}CC` : 'rgba(0, 0, 0, 0.2)'};
  border: 2px solid ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.radii.md};
  color: #fff;
  cursor: pointer;
  transition: ${({ theme }) =>
    `all ${theme.motion.durations.base} ${theme.motion.easings.standard}`};

  span:first-child {
    font-size: 20px;
  }

  span:last-child {
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    text-align: center;
    word-break: break-word;
    text-overflow: ellipsis;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 12px ${({ $color }) => $color}77;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const SageSelector = ({ activeSageId, onSelect }) => {
  const nonMetaSages = sagesConfig.sages.filter(s => !s.isMeta);
  const gouvernail = sagesConfig.sages.find(s => s.isMeta);

  return (
    <SageSelectorContainer>
      {nonMetaSages.map(sage => (
        <SageButton
          key={sage.id}
          $color={sage.color}
          $active={activeSageId === sage.id}
          onClick={() => onSelect(sage.id)}
          title={sage.specialty}
        >
          <span>{sage.emoji}</span>
          <span>{sage.name}</span>
        </SageButton>
      ))}

      {gouvernail && (
        <SageButton
          key={gouvernail.id}
          $color={gouvernail.color}
          $active={activeSageId === gouvernail.id}
          onClick={() => onSelect(gouvernail.id)}
          title={`${gouvernail.name} - ${gouvernail.specialty}`}
          style={{ gridColumn: '1 / -1' }}
        >
          <span>{gouvernail.emoji}</span>
          <span>{gouvernail.name}</span>
        </SageButton>
      )}
    </SageSelectorContainer>
  );
};
