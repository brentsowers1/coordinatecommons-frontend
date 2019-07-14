import { connect } from 'react-redux';
import getHighlightedPlace from '../reducers/getHighlightedPlace';
import PlaceInfo from '../components/PlaceInfo';

const mapStateToProps = state => {
  const highlightedPlace = getHighlightedPlace(state);
  return {
    name: highlightedPlace ? highlightedPlace.name : '',
    status: 'asdf'
  };
}

export default connect(mapStateToProps)(PlaceInfo);
