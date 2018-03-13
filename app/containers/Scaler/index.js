/**
 *
 * Scalre
 *
 */

import { connect } from 'react-redux';
import Slider from '../../components/Slider';
import { setScale } from './actions';

const mapStateToProps = (state) => ({
  value: state.scale,
});

function mapDispatchToProps(dispatch) {
  return {
    onChange: (value) => dispatch(setScale(value))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Slider);
