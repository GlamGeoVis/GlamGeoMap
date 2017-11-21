import { connect } from 'react-redux';
import RightSideBar from '../../components/RightSideBar';

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(RightSideBar);
