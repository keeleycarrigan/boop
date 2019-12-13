import _ from 'lodash';
import styled from 'styled-components';
import React from 'react';
import Flkty from 'flickity';

export default class Flickity extends React.Component {
  constructor() {
    super();
    this.container = React.createRef();
  }

  componentDidMount() {
    const options = _.clone(this.props);
    this.flkty = new Flkty(this.container.current, options);
  }

  render() {
    return (
      <Container ref={this.container}>
        {this.props.children}
      </Container>
    );
  }
}

const Container = styled.div`
  scroll-snap-align: start;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  position: absolute;
`;
