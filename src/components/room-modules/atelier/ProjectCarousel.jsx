// src/components/room-modules/atelier/ProjectCarousel.jsx

import React from 'react';
import styled from 'styled-components';
import { metalBg, secondaryLevel } from '../../../styles/mixins';
import useProjectMetaStore from '../../../stores/useProjectMetaStore';

const Container = styled.div`
  height: 50px;
  min-width: 33%;
  margin: 0 auto ${({ theme }) => theme.spacing.sm};
  ${metalBg}
  ${secondaryLevel}
  border: 1px solid ${({ theme }) => theme.colors.text.light};

  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
`;

const Button = styled.button`
  width: 40px;
  height: 50px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.light};
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

const Center = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.light};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  line-height: 1;
`;

const ProjectCarousel = () => {
  const { getCurrentProject, selectProject, visibleProjects } = useProjectMetaStore();
  const currentProject = getCurrentProject();

  if (!currentProject || visibleProjects.length === 0) {
    return null;
  }

  const currentIndex = visibleProjects.indexOf(currentProject.id);

  const goPrev = () => {
    const newIndex = currentIndex === 0 ? visibleProjects.length - 1 : currentIndex - 1;
    selectProject(visibleProjects[newIndex]);
  };

  const goNext = () => {
    const newIndex = currentIndex === visibleProjects.length - 1 ? 0 : currentIndex + 1;
    selectProject(visibleProjects[newIndex]);
  };

  return (
    <Container>
      <Button onClick={goPrev}>◀</Button>
      <Center>
        <Title>{currentProject.name}</Title>
      </Center>
      <Button onClick={goNext}>▶</Button>
    </Container>
  );
};

export default ProjectCarousel;