import { connect } from 'react-redux';
import Layout from '../../components/Layout';

const mapStateToProps = (state) => ({ layout: state.layout });

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
