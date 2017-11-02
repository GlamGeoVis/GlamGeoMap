import { connect } from 'react-redux';
import LeafletMap from '../../components/LeafletMap';

const mapStateToProps = (state) => ({ data: state.get('data').clusters });

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LeafletMap);
