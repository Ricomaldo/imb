// src/components/widgets/DiaryArchive/DiaryArchive.styles.js

import styled from 'styled-components';

export const ArchiveContainer = styled.div`
  display: flex;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  overflow: hidden;
`;

export const MonthsList = styled.div`
  width: 140px;
  background: rgba(255, 255, 255, 0.3);
  border-right: 1px solid rgba(139, 115, 85, 0.2);
  padding: 8px;
  overflow-y: auto;
  flex-shrink: 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(139, 115, 85, 0.3);
    border-radius: 2px;

    &:hover {
      background: rgba(139, 115, 85, 0.4);
    }
  }
`;

export const MonthItem = styled.div`
  padding: 6px 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  color: ${props => props.$isActive ? '#3a2a1a' : '#5a4a3a'};
  background: ${props => props.$isActive ? 'rgba(139, 115, 85, 0.15)' : 'transparent'};
  transition: all 0.2s ease;
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: rgba(139, 115, 85, 0.1);
  }
`;

export const ArchiveContent = styled.div`
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  min-width: 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(139, 115, 85, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(139, 115, 85, 0.4);
    }
  }
`;

export const ArchiveHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(139, 115, 85, 0.2);
  font-size: 14px;
  font-weight: 600;
  color: #4a3a2a;
  text-transform: capitalize;
  gap: 8px;
`;

export const ExportButton = styled.button`
  padding: 4px 8px;
  background: rgba(139, 115, 85, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: rgba(139, 115, 85, 0.85);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const NoArchivesMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  text-align: center;
  color: #8b7355;
  font-size: 13px;
  line-height: 1.6;
`;

export const DayEntry = styled.div`
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  padding: 10px 12px;
  border: 1px solid rgba(139, 115, 85, 0.15);

  &:last-child {
    margin-bottom: 0;
  }
`;

export const DayHeader = styled.h3`
  margin: 0 0 8px 0;
  color: #4a3a2a;
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const DeleteButton = styled.button`
  background: ${props => {
    if (props.$isEdit) {
      return props.$isActive
        ? 'rgba(60, 150, 220, 0.9)'
        : 'rgba(100, 100, 100, 0.6)';
    }
    return 'rgba(220, 60, 60, 0.7)';
  }};
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  font-size: ${props => props.$isEdit ? '14px' : '18px'};
  font-weight: bold;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    background: ${props => {
      if (props.$isEdit) {
        return props.$isActive
          ? 'rgba(60, 150, 220, 1)'
          : 'rgba(100, 100, 100, 0.8)';
      }
      return 'rgba(220, 60, 60, 0.9)';
    }};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const DayContent = styled.div`
  min-height: 40px;
  font-size: 12px;
  line-height: 1.5;
  color: #5a4a3a;

  // Style pour le MarkdownEditor en lecture seule
  .markdown-editor-container {
    background: transparent !important;
    border: none !important;
  }

  .markdown-preview {
    padding: 4px 0 !important;
    background: transparent !important;
    font-size: 12px;
    line-height: 1.6;

    h1, h2, h3, h4, h5, h6 {
      color: #3a2a1a;
      margin-top: 8px;
      margin-bottom: 4px;
      font-size: 13px;
    }

    p {
      margin-bottom: 8px;
    }

    ul, ol {
      margin-left: 16px;
      margin-bottom: 8px;
    }

    code {
      background: rgba(139, 115, 85, 0.1);
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 11px;
    }

    blockquote {
      border-left: 2px solid rgba(139, 115, 85, 0.3);
      padding-left: 8px;
      margin-left: 0;
      color: #6a5a4a;
      font-style: italic;
      font-size: 11px;
    }
  }
`;