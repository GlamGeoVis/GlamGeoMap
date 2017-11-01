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

const mapStateToProps = (state) => state.get('timeline');

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
