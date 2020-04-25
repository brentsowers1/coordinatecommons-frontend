import { connect } from 'react-redux';
import MousePosition from '../components/MousePosition';

const mapStateToProps = state => {
  return {
    lat: state.places.mouseLocation.lat,
    lng: state.places.mouseLocation.lng
  };
}

export default connect(mapStateToProps)(MousePosition);
