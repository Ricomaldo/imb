// src/components/modals/SettingsModal/SettingsModal.styles.js

import styled from 'styled-components';

export const SettingsContainer = styled.div`
  padding: 20px;
  min-width: 400px;
`;

export const SettingsSection = styled.div`
  margin-bottom: 25px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SettingsTitle = styled.h3`
  color: ${props => props.theme.colors.accent};
  font-size: 18px;
  margin-bottom: 8px;
  font-weight: 600;
`;

export const SettingsDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.4;
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  background: ${props => props.theme.colors.backgroundLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.accent}33;
  }

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  option {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    padding: 5px;
  }
`;

export const SaveButton = styled.button`
  background: ${props => props.theme.colors.accent};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;

  &:hover {
    background: ${props => props.theme.colors.accentHover};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StatusMessage = styled.div`
  margin-top: 15px;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;

  background: ${props => props.type === 'success'
    ? 'rgba(76, 175, 80, 0.1)'
    : props.type === 'error'
    ? 'rgba(244, 67, 54, 0.1)'
    : 'rgba(255, 152, 0, 0.1)'
  };

  color: ${props => props.type === 'success'
    ? '#4CAF50'
    : props.type === 'error'
    ? '#F44336'
    : '#FF9800'
  };

  border: 1px solid ${props => props.type === 'success'
    ? 'rgba(76, 175, 80, 0.3)'
    : props.type === 'error'
    ? 'rgba(244, 67, 54, 0.3)'
    : 'rgba(255, 152, 0, 0.3)'
  };
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const TabButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.$active
    ? props.theme.colors.backgroundLight
    : 'transparent'};
  color: ${props => props.$active
    ? props.theme.colors.text
    : props.theme.colors.textSecondary};
  border: none;
  border-bottom: 2px solid ${props => props.$active
    ? props.theme.colors.accent
    : 'transparent'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundLight};
    color: ${props => props.theme.colors.text};
  }
`;

export const TabContent = styled.div`
  min-height: 300px;
`;