import { connect } from 'react-redux';
import LeafletMap from '../../components/LeafletMap/LeafletMap';

const mapStateToProps = (state) => ({ data: state.data.clusters, total: state.data.total });

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(LeafletMap);
