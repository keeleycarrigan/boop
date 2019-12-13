import React from 'react';
import styled from 'styled-components';
import Footer from './footer';
import Slide from './slide';
import Flickity from './flickity';

export default (props) => {
  if (!props.selected) {
    return null;
  }

  const selector = props.slideSelector;

  return (
    <>
      <BackButton onClick={props.onClose}>
        <i className="fa fa-arrow-left" />
      </BackButton>
      <ModalContainer>
        <Flickity cellSelector={`.${selector}`} dragThreshold={20}>
          <Slide classes={selector}>
            Slide: 1
            <br />
            ID: {props.panelID}
          </Slide>
          <Slide classes={selector}>
            Slide: 2
            <br />
            ID: {props.panelID}
          </Slide>
          <Slide classes={selector}>
            Slide: 3
            <br />
            ID: {props.panelID}
          </Slide>
          <Slide classes={selector}>
            Slide: 4
            <br />
            ID: {props.panelID}
          </Slide>
        </Flickity>
        <Footer top="100%" />
      </ModalContainer>
    </>
  );
};

const ModalContainer = styled.div`
  overflow: scroll;
  z-index: 200;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  position: fixed;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
`;

const BackButton = styled.div`
  cursor: pointer;
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 250;
  width: 1em;
  height: 1em;
  line-height: 1em;
  text-align: center;
  border-radius: 3em;
  padding: 0.5ch 0.5ch;
  color: white;
  background-color: rgb(233, 50, 50);
`;
