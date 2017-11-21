import { connect } from 'react-redux';
import RightSideBar from '../../components/RightSideBar';

const mapStateToProps = (state) => ({ data: state.clusterDetails });

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RightSideBar);
