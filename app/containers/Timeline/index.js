/**
 *
 * Timeline
 *
 */

import { connect } from 'react-redux';
import { compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import Timeline from '../../components/Timeline/Timeline';

const mapStateToProps = (state) => ({
  timeline: state.get('timeline').timeline,
  years: state.get('data').years,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'timeline', reducer });

export default compose(
  withReducer,
  withConnect,
)(Timeline);
