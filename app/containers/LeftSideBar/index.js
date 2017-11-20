import { connect } from 'react-redux';
import LeftSideBar from '../../components/LeftSideBar';

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(LeftSideBar);
