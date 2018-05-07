import { connect } from 'react-redux';
import Slider from '../components/Slider';
import { setScale } from '../redux/Scaler/actions';

const mapStateToProps = (state) => ({
  value: state.scale,
  zoomToScale: state.zoomToScale,
});

function mapDispatchToProps(dispatch) {
  return {
    onChange: (value) => dispatch(setScale(value))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Slider);
