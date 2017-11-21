import { connect } from 'react-redux';
import md5 from 'md5';
import LeafletMap from '../../components/LeafletMap/LeafletMap';

const mapStateToProps = (state) => ({
  data: state.data.clusters,
  total: state.data.total,
  filterHash: md5(JSON.stringify({
    filters: state.filters,
    timeline: state.timeline,
  })),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(LeafletMap);
