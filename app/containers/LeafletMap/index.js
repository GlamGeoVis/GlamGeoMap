import { connect } from 'react-redux';
import md5 from 'md5';
import LeafletMap from '../../components/LeafletMap/LeafletMap';

const mapStateToProps = (state) => ({
  clusters: state.data.clusters,
  leafs: state.data.leafs,
  total: state.data.total,
  filterHash: md5(JSON.stringify({
    filters: state.filters,
    timeline: state.timeline,
  })),
  scale: state.scale,
  dataSet: state.fixedData.dataSets[state.fixedData.currentDataSet],
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(LeafletMap);
