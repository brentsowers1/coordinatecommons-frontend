import { connect } from 'react-redux';
import PlaceList from '../components/PlaceList';
import { placeClicked } from '../actions/PlaceActions';

const getCurrentPlaceList = (allPlaces, activePlaceType) => {
  return allPlaces ? allPlaces.filter(place => place.type === activePlaceType) : [];
}

const mapStateToProps = (state, ownProps) => {
  return {
    places: getCurrentPlaceList(state.places.allPlaces, state.places.activePlaceType),
    selectedPlaceId: state.places.selectedPlaceId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPlaceClick: (place) => {
      dispatch(placeClicked(place));
    }
  }
}

const ActivePlaceList = connect(mapStateToProps, mapDispatchToProps)(PlaceList);

export default ActivePlaceList;
