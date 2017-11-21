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
      <Panel style={{ overflow: 'scroll', height: '100%' }}>
        <ul>
          {this.props.data.map((book) => (
            <li>
              {book.title}
            </li>
          ))}
        </ul>
      </Panel>
    );
  }
}

RightSideBar.propTypes = {
  // dispatch: PropTypes.func,
  data: PropTypes.array,
};
