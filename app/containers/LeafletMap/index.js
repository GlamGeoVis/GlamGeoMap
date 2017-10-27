import { connect } from 'react-redux';
import LeafletMap from '../../components/LeafletMap';

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(LeafletMap);
