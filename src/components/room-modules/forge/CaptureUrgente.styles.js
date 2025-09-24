// src/components/room-modules/forge/CaptureUrgente.styles.js

import styled from 'styled-components';

export const CaptureContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg,
    ${({ theme }) => theme.colors.background} 0%,
    ${({ theme }) => theme.colors.muted || '#f5f5f5'} 100%
  );
  border-radius: ${({ theme }) => theme.radii.lg};
  position: relative;
`;

export const CaptureForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.text?.primary || theme.colors.primary};
  font-size: ${({ theme }) => theme.typography?.sizes?.sm || '14px'};
  font-weight: ${({ theme }) => theme.typography?.weights?.semibold || 600};
  font-family: ${({ theme }) => theme.typography?.families?.ui || theme.fonts.main};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.surfaces?.base || '#ffffff'};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text?.primary || theme.colors.primary};
  font-size: ${({ theme }) => theme.typography?.sizes?.base || '14px'};
  font-family: ${({ theme }) => theme.typography?.families?.secondary || theme.fonts.main};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text?.secondary || theme.colors.secondary};
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accents?.cold || theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accents?.cold || theme.colors.accent}22;
    background: linear-gradient(to bottom,
      ${({ theme }) => theme.surfaces?.base || '#ffffff'},
      ${({ theme }) => theme.surfaces?.muted || '#f9f9f9'}
    );
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accents?.warm || theme.colors.accent};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.surfaces?.base || '#ffffff'};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text?.primary || theme.colors.primary};
  font-size: ${({ theme }) => theme.typography?.sizes?.base || '14px'};
  font-family: ${({ theme }) => theme.typography?.families?.secondary || theme.fonts.main};
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;
  line-height: ${({ theme }) => theme.typography?.lineHeights?.relaxed || 1.6};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text?.secondary || theme.colors.secondary};
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accents?.cold || theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accents?.cold || theme.colors.accent}22;
    background: linear-gradient(to bottom,
      ${({ theme }) => theme.surfaces?.base || '#ffffff'},
      ${({ theme }) => theme.surfaces?.muted || '#f9f9f9'}
    );
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accents?.warm || theme.colors.accent};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.surfaces?.base || '#ffffff'};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text?.primary || theme.colors.primary};
  font-size: ${({ theme }) => theme.typography?.sizes?.base || '14px'};
  font-family: ${({ theme }) => theme.typography?.families?.ui || theme.fonts.main};
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing.md} center;
  background-size: 20px;
  padding-right: ${({ theme }) => theme.spacing['3xl']};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accents?.cold || theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accents?.cold || theme.colors.accent}22;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accents?.warm || theme.colors.accent};
    background: linear-gradient(to bottom,
      ${({ theme }) => theme.surfaces?.base || '#ffffff'},
      ${({ theme }) => theme.surfaces?.muted || '#f9f9f9'}
    );
  }

  option {
    background: ${({ theme }) => theme.surfaces?.base || '#ffffff'};
    color: ${({ theme }) => theme.colors.text?.primary || theme.colors.primary};
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const CaptureButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg,
    ${({ theme }) => theme.colors.accents?.cold || theme.colors.accent} 0%,
    ${({ theme }) => theme.colors.stone || '#708090'} 100%
  );
  color: ${({ theme }) => theme.colors.text?.light || '#ffffff'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography?.sizes?.base || '14px'};
  font-weight: ${({ theme }) => theme.typography?.weights?.semibold || 600};
  font-family: ${({ theme }) => theme.typography?.families?.ui || theme.fonts.main};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography?.letterSpacing?.wide || '0.025em'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg,
      ${({ theme }) => theme.colors.stone || '#708090'} 0%,
      ${({ theme }) => theme.colors.accents?.cold || theme.colors.accent} 100%
    );
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const CancelButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.surfaces?.muted || '#f5f5f5'};
  color: ${({ theme }) => theme.colors.text?.secondary || theme.colors.secondary};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography?.sizes?.base || '14px'};
  font-weight: ${({ theme }) => theme.typography?.weights?.medium || 500};
  font-family: ${({ theme }) => theme.typography?.families?.ui || theme.fonts.main};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.accents?.danger || theme.colors.border};
    color: ${({ theme }) => theme.colors.accents?.danger || theme.colors.primary};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const SuccessMessage = styled.div`
  position: absolute;
  top: -${({ theme }) => theme.spacing['2xl']};
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg,
    ${({ theme }) => theme.colors.accents?.success || '#68752C'} 0%,
    ${({ theme }) => theme.colors.accents?.success || '#68752C'}dd 100%
  );
  color: ${({ theme }) => theme.colors.text?.light || '#ffffff'};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography?.sizes?.sm || '12px'};
  font-weight: ${({ theme }) => theme.typography?.weights?.semibold || 600};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
  z-index: 10;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
  }
`;