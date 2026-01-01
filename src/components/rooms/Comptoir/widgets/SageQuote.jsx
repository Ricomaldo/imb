import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import quotesData from '../../../../data/sagesQuotes.json';

const QuoteContainer = styled.div`
  margin: 15px 0;
  padding: 15px;
  border-left: 3px solid ${props => props.color};
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const QuoteText = styled.p`
  font-size: 0.95em;
  font-style: italic;
  margin: 0 0 10px 0;
  line-height: 1.5;
  opacity: 0.95;
`;

const RefreshButton = styled.button`
  background: ${props => props.color};
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85em;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const SageQuote = ({ sageId, color }) => {
  const [quote, setQuote] = useState('');

  const getRandomQuote = () => {
    const quotes = quotesData[sageId] || [];
    if (quotes.length === 0) return '';
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  useEffect(() => {
    setQuote(getRandomQuote());
  }, [sageId]);

  const refreshQuote = () => {
    setQuote(getRandomQuote());
  };

  return (
    <QuoteContainer color={color}>
      <QuoteText>"{quote}"</QuoteText>
      <RefreshButton color={color} onClick={refreshQuote}>
        Autre citation
      </RefreshButton>
    </QuoteContainer>
  );
};
