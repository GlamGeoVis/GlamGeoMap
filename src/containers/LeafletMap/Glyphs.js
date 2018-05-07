import { connect } from 'react-redux';
import Glyphs from '../../components/LeafletMap/Glyphs';

const mapStateToProps = (state) => ({
  glyphs: state.glyphs,
  zoomLevel: state.leafletMap.zoomLevel,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Glyphs);
