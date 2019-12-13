import React from 'react';
import styled from 'styled-components';
import SlideModal from './modal';

export default (props) => {
  const slideSelector = `root-${props.panelID}`;
  const onClick = () => props.onPanelCTAClick(props.panelID);

  return (
    <ScrollContainer>
      <PanelContainer
        onClick={onClick}
        style={props.style}
      >
        {props.children}
      </PanelContainer>
      <SlideModal
        {...props}
        selected={props.selected}
        onClose={props.onPanelClose}
        slideSelector={slideSelector}
      />
    </ScrollContainer>
  );
}

const ScrollContainer = styled.div`
  scroll-snap-align: start;
  padding-top: 10px;
  margin: 0px 10px;
  &:nth-last-child(2) {
    margin-bottom: 10px;
  }
`;

const PanelContainer = styled.div`
  height: 78vh;
  width: calc(100vw - 20px);
  border-radius: 30px;
  background: linear-gradient(\
    hsla(220, 30%, 80%, 1),\
    hsla(0, 9%, 70%, 1)\
  );
`;
