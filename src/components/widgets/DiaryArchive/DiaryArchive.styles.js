// src/components/widgets/DiaryArchive/DiaryArchive.styles.js

import styled from 'styled-components';

export const ArchiveContainer = styled.div`
  display: flex;
  height: 100%;
  background: linear-gradient(135deg, #f9f7f4 0%, #f0ebe3 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
`;

export const MonthsList = styled.div`
  width: 220px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  border-right: 2px solid rgba(139, 115, 85, 0.15);
  padding: 20px 16px;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(139, 115, 85, 0.05);
    border-radius: 4px;
    margin: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(139, 115, 85, 0.3) 0%, rgba(139, 115, 85, 0.4) 100%);
    border-radius: 4px;
    border: 2px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: linear-gradient(180deg, rgba(139, 115, 85, 0.4) 0%, rgba(139, 115, 85, 0.5) 100%);
    }
  }
`;

export const MonthItem = styled.div`
  padding: 12px 14px;
  margin-bottom: 6px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: ${props => props.$isActive ? '600' : '500'};
  color: ${props => props.$isActive ? '#3a2a1a' : '#6a5a4a'};
  background: ${props => props.$isActive
    ? 'linear-gradient(135deg, rgba(139, 115, 85, 0.2) 0%, rgba(139, 115, 85, 0.15) 100%)'
    : 'transparent'};
  border: 1px solid ${props => props.$isActive ? 'rgba(139, 115, 85, 0.3)' : 'transparent'};
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: capitalize;
  letter-spacing: 0.3px;
  box-shadow: ${props => props.$isActive ? '0 2px 6px rgba(139, 115, 85, 0.15)' : 'none'};
  position: relative;

  &::before {
    content: '📅';
    margin-right: 8px;
    opacity: ${props => props.$isActive ? '1' : '0.6'};
    font-size: 14px;
    transition: opacity 0.25s ease;
  }

  &:hover {
    background: ${props => props.$isActive
      ? 'linear-gradient(135deg, rgba(139, 115, 85, 0.25) 0%, rgba(139, 115, 85, 0.2) 100%)'
      : 'rgba(139, 115, 85, 0.08)'};
    border-color: rgba(139, 115, 85, 0.25);
    transform: translateX(2px);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateX(1px);
  }
`;

export const ArchiveContent = styled.div`
  flex: 1;
  padding: 28px 32px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(139, 115, 85, 0.05);
    border-radius: 5px;
    margin: 8px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(139, 115, 85, 0.25) 0%, rgba(139, 115, 85, 0.35) 100%);
    border-radius: 5px;
    border: 2px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: linear-gradient(180deg, rgba(139, 115, 85, 0.35) 0%, rgba(139, 115, 85, 0.45) 100%);
    }
  }
`;

export const ArchiveHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 3px double rgba(139, 115, 85, 0.2);
  font-size: 22px;
  font-weight: 700;
  color: #3a2a1a;
  text-transform: capitalize;
  letter-spacing: 0.5px;

  &::before {
    content: '📚';
    margin-right: 12px;
    font-size: 24px;
  }
`;

export const ExportButton = styled.button`
  padding: 8px 16px;
  background: linear-gradient(135deg, #8b7355 0%, #6d5a45 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  letter-spacing: 0.3px;

  &::before {
    content: '📥 ';
    margin-right: 4px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.18);
    background: linear-gradient(135deg, #9a8264 0%, #7c6954 100%);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  }
`;

export const NoArchivesMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 60px 40px;
  text-align: center;
  color: #8b7355;
  font-size: 15px;
  line-height: 1.8;

  &::before {
    content: '📖';
    font-size: 48px;
    margin-bottom: 20px;
    opacity: 0.5;
  }
`;

export const DayEntry = styled.div`
  margin-bottom: 28px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  border-radius: 12px;
  padding: 20px 24px;
  border: 1px solid rgba(139, 115, 85, 0.15);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: all 0.25s ease;
  position: relative;

  /* Effet "page de livre" avec coin plié */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 16px 16px 0;
    border-color: transparent rgba(139, 115, 85, 0.1) transparent transparent;
    border-radius: 0 0 0 4px;
  }

  &:hover {
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }
`;

export const DayHeader = styled.h3`
  margin: 0 0 16px 0;
  color: #3a2a1a;
  font-size: 17px;
  font-weight: 600;
  text-transform: capitalize;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(139, 115, 85, 0.12);
  letter-spacing: 0.3px;

  &::before {
    content: '📄';
    margin-right: 8px;
    font-size: 16px;
  }
`;

export const DayContent = styled.div`
  min-height: 80px;

  // Style pour le MarkdownEditor en lecture seule
  .markdown-editor-container {
    background: transparent !important;
    border: none !important;
  }

  .markdown-preview {
    padding: 12px 8px !important;
    background: transparent !important;
    color: #4a3a2a;
    font-size: 14px;
    line-height: 1.7;

    h1, h2, h3, h4, h5, h6 {
      color: #3a2a1a;
      margin-top: 16px;
      margin-bottom: 8px;
    }

    p {
      margin-bottom: 12px;
    }

    ul, ol {
      margin-left: 20px;
      margin-bottom: 12px;
    }

    code {
      background: rgba(139, 115, 85, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 13px;
    }

    blockquote {
      border-left: 3px solid rgba(139, 115, 85, 0.3);
      padding-left: 16px;
      margin-left: 0;
      color: #6a5a4a;
      font-style: italic;
    }
  }
`;