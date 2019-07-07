import { connect } from 'react-redux';
import Places from '../components/Places';
import { placeTypeChanged, placeClicked } from '../actions/PlaceActions';

const getCurrentPlaceList = (allPlaces, activePlaceType) => {
  return allPlaces ? allPlaces[activePlaceType] : [];
}

const mapStateToProps = (state, ownProps) => {
  const activePlaceType = ownProps.match.params.placeType ? 
    ownProps.match.params.placeType : 
    state.places.activePlaceType;
  return {
    places: getCurrentPlaceList(state.places.placeTypes, activePlaceType),
    selectedPlaceId: state.places.selectedPlaceId,
    activePlaceType: activePlaceType
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    placeTypeChanged: (placeType) => {
      dispatch(placeTypeChanged(placeType));
    },
    onPlaceClick: (place) => {
      dispatch(placeClicked(place));
    }
  }
}

const ActivePlaces = connect(mapStateToProps, mapDispatchToProps)(Places);

export default ActivePlaces;
