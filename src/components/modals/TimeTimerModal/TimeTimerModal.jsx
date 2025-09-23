// src/components/modals/TimeTimerModal/TimeTimerModal.jsx

import React from 'react';
import Modal from '../../common/Modal/Modal';
import TimeTimer from '../../widgets/TimeTimer';
import styled from 'styled-components';

const TimerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm};
  box-sizing: border-box;
`;

/**
 * TimeTimer modal with baseFloorTower variant
 * @renders Modal
 * @renders TimerContainer
 * @renders TimeTimer
 */
const TimeTimerModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="baseFloorTower"
      showCloseButton={false}
      showFooterCloseButton={false}
      width="500px"
      maxWidth="90vw"
    >
      <TimerContainer>
        <TimeTimer
          colorSelect={true}
          maxSize={400}
          diskColor="#4A5568"
        />
      </TimerContainer>
    </Modal>
  );
};

export default TimeTimerModal;