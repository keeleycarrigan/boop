import React, { Component } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import Panel from './panel';
import Footer from './footer';

class App extends Component {
  panels = {
    panel1: {
    },
    panel2: {
    },
    panel3: {
    },
  }

  state = {
    selected: null,
  }

  handlePanelCTAClick = (id) => {
    this.setState({ selected: id });
  }

  handlePanelClose = () => {
    this.setState({ selected: null });
  }

  render() {
    const panels = _.toPairs(this.panels).map(([id, options]) => (
      <Panel
        key={id} 
        {...options}
        panelID={id} 
        selected={this.state.selected === id}
        onPanelCTAClick={this.handlePanelCTAClick}
        onPanelClose={this.handlePanelClose}
      />
    ));

    return (
      <PanelsContainer>
        {panels}
        <Footer />
      </PanelsContainer>
    );
  }
}

const PanelsContainer = styled.div`
  overflow: scroll;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  position: absolute;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
`;

export default App;
