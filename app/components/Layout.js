import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Glyphicon } from 'react-bootstrap';

import { toggleBar as toggleBarAction } from '../containers/Layout/actions';

import Timeline from '../containers/Timeline/index';
import LeafletMap from '../containers/LeafletMap/index';
import LeftSideBar from '../containers/LeftSideBar';
import RightSideBar from '../containers/RightSideBar';

export default class Layout extends React.Component {
  state = {
    bars: {
      left: false,
      right: false,
      bottom: true,
    },
  };

  invalidateSizeWhenBarIsToggled = false;
  leafletMap = null;

  toggleBar = (name) => () => {
    this.props.dispatch(toggleBarAction(name));
    if (this.invalidateSizeWhenBarIsToggled) {
      setTimeout(() => {
        this.leafletMap.wrappedInstance.invalidateSize();
      }, 300);
    }
  };

  sideBar = (contents, handleContents, position = 'left') => (
    <SideBarContainer active={this.props.layout.bars[position]} >
      <div className="sideBarContents">{contents}</div>
      <SideHandle
        position={position}
        onClick={this.toggleBar(position)}
      >
        <Vertical>
          { handleContents }
        </Vertical>
      </SideHandle>
    </SideBarContainer>
  );

  render() {
    return (
      <Container>
        <TopSection>
          { this.sideBar(
            <LeftSideBar />,
            <span><Glyphicon glyph="filter" /> Filter</span>,
            'left'
          ) }
          <LeafletMap
            ref={(elm) => { this.leafletMap = elm; }}
            style={{ flex: 1, zIndex: 1 }}
          />
          { this.sideBar(
            <RightSideBar />,
            <span><Glyphicon glyph="book" /> Selected works</span>,
            'right'
          ) }
        </TopSection>
        <BottomBarContainer active={this.props.layout.bars.bottom}>
          <div className="bottomBarContents">
            <Timeline minYear={1650} maxYear={1950} />
          </div>
          <BottomHandle onClick={this.toggleBar('bottom')}>
            <Glyphicon glyph="signal" /> Timeline
          </BottomHandle>
        </BottomBarContainer>
      </Container>
    );
  }
}

Layout.propTypes = {
  layout: PropTypes.object,
  dispatch: PropTypes.func,
};

const handleWidth = 18;
const shadowColor = '#666';
const shadowRadius = '10';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  overflow: hidden;
`;

const TopSection = styled.div`
  flex: 1;
  display: flex;
  overflow-y: auto;
`;

const Bar = styled.div`
  position: relative;
  z-index:100;
  transition: all .3s;
`;

const SideBarContainer = Bar.extend`
  width: ${(props) => props.active ? 300 : 0}px;
  >div {
    overflow: hidden;
    height: 100%;
  }
`;

const BottomBarContainer = Bar.extend`
  height: ${(props) => props.active ? 140 : 0}px;
  display: flex;
  > div:first-child {
    overflow: hidden;
    width: 100%;
  }
`;

const Handle = styled.div`
  position: absolute;
  background-color: #ddd;
  cursor: pointer;
`;

const BottomHandle = Handle.extend`
  left: 0;
  height: ${handleWidth}px;
  width: 100%;
  text-align: center;
  top: -${handleWidth}px;
  box-shadow: 0 -5px ${shadowRadius}px ${shadowColor};

`;

const SideHandle = Handle.extend`
  top: 0;
  width: ${handleWidth}px;
  height: calc(100% - ${handleWidth}px);  
  ${(props) => props.position === 'right' ? 'left' : 'right'}: -${handleWidth}px;
  box-shadow: ${(props) => props.position === 'right' && '-'}5px 0 ${shadowRadius}px ${shadowColor};
`;

const Vertical = styled.div`
 width: 100%;
 height: 100%;
 writing-mode: vertical-lr;
 text-align: center;
 & .glyphicon {
  transform: rotate(90deg);
 }
`;
