import React, { Component } from 'react';
import styled from 'styled-components';

export default class Slide extends Component {
  render() {
    const classes = this.props.classes || "slide";
    return (
      <Container className={classes}>
        {this.props.children}
      </Container>
    );
  }
}

const Container = styled.div`
  background: linear-gradient(\
    hsla(0, 0%, 30%, 1),\
    hsla(0, 0%, 50%, 1)\
  );
  color: white;
  border: 4px solid hsla(0, 0%, 0%, 0.9) inset;
  height: 100%;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;
