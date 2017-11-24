import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import styled from 'styled-components';
import 'react-table/react-table.css';

export default class RightSideBar extends React.Component {
  onEnterApply = (e) => {
    if (e.charCode === 13) {
      this.setFilters();
    }
  };

  render() {
    if (!this.props.data) {
      return null;
    }
    return (
      <StyledReactTable
        data={this.props.data}
        columns={[
          {
            Header: 'Year',
            accessor: 'year',
            maxWidth: 50,
          },
          {
            Header: 'Title',
            accessor: 'title',
          },
          {
            Header: 'Author',
            accessor: 'author',
          },
        ]}
        defaultPageSize={25}
        className="-highlight"
      />
    );
  }
}

RightSideBar.propTypes = {
  // dispatch: PropTypes.func,
  data: PropTypes.array,
};

const StyledReactTable = styled(ReactTable)`
  height: 100%;
  padding-bottom: 25px;
  .rt-thead {
    background-color: purple;
    color: white;
    
    .rt-resizable-header {
      border-right: 1px solid rgba(255,255,255,.5);
    }
  }
  .rt-td {
    background-color: #F0F0F6;
    border-right: 2px solid black !important;
    border-bottom: 2px solid black !important;
    white
  }
`;
