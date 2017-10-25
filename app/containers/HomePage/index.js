/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import styled from 'styled-components';
import LeafletMap from '../../components/LeafletMap';

export default class Layout extends React.Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 8,
    bars: {
      left: false,
      right: false,
      bottom: false,
    },
  };

  leafletMap = null;

  toggleBar = (name) => () => {
    this.setState({ bars: { ...this.state.bars, [name]: !this.state.bars[name] } });
    setTimeout(() => {
      this.leafletMap.invalidateSize();
    }, 300);
  };

  render() {
    const position = [this.state.lat, this.state.lng];

    return (
      <Container>
        <TopSection>
          <SideBar active={this.state.bars.left} onClick={this.toggleBar('left')} >
            left
          </SideBar>
          <LeafletMap
            ref={(elm) => { this.leafletMap = elm; }}
            style={{ flex: 1 }}
            position={position}
          />
          <SideBar active={this.state.bars.right} onClick={this.toggleBar('right')}>
            right
          </SideBar>
        </TopSection>
        <BottomBar active={this.state.bars.bottom} onClick={this.toggleBar('bottom')}>
          timeline
        </BottomBar>
      </Container>
    );
  }
}

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const TopSection = styled.div`
  flex-grow: 1;
  display: flex;
`;

const Bar = styled.div`
  overflow: hidden;
  transition: flex .3s;
  cursor: ${(props) => props.active ? 'default' : 'pointer'};
`;

const SideBar = Bar.extend`
  flex: ${(props) => props.active ? 0.1 : 0.01};
`;

const BottomBar = Bar.extend`
  background-Color: red;
  flex: ${(props) => props.active ? 0.2 : 0.03};
  min-height: 10px;
`;
