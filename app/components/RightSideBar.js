import React from 'react';
import PropTypes from 'prop-types';

import { Panel } from 'react-bootstrap';

export default class RightSideBar extends React.Component {
  onEnterApply = (e) => {
    if (e.charCode === 13) {
      this.setFilters();
    }
  };

  render() {
    return (
      <Panel>
        bla123123
      </Panel>
    );
  }
}

RightSideBar.propTypes = {
  dispatch: PropTypes.func,
};
