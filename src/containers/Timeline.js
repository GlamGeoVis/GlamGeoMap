/**
 *
 * Timeline
 *
 */

import { connect } from 'react-redux';

import Timeline from '../components/Timeline/Timeline';

const mapStateToProps = (state) => ({
  timeline: state.timeline,
  years: state.data.years,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
