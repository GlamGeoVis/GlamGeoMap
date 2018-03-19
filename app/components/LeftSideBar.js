import React from 'react';
import PropTypes from 'prop-types';

import { FormControl, ControlLabel, FormGroup, Panel, Button } from 'react-bootstrap';
import { setFilter } from '../redux/LeftSideBar/actions';

export default class LeftSideBar extends React.Component {
  onEnterApply = (e) => {
    if (e.charCode === 13) {
      this.setFilters();
    }
  };

  setFilters = () => {
    this.props.dispatch(setFilter('author', this.authorField.value));
    this.props.dispatch(setFilter('title', this.titleField.value));
  };

  render() {
    return (
      <Panel>
        <FormGroup>
          <ControlLabel>Author</ControlLabel>
          <FormControl onKeyPress={this.onEnterApply} inputRef={(elm) => { this.authorField = elm; }} type="text" placeholder="Author" />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <FormControl onKeyPress={this.onEnterApply} inputRef={(elm) => { this.titleField = elm; }} type="text" placeholder="Title" />
        </FormGroup>
        <FormGroup>
          <Button onClick={this.setFilters} bsStyle="primary">Search</Button>
        </FormGroup>
      </Panel>
    );
  }
}

LeftSideBar.propTypes = {
  dispatch: PropTypes.func,
};
