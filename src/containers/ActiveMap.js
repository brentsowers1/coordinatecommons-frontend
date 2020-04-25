import { connect } from "react-redux";
import getSelectedPlace from '../reducers/getSelectedPlace';
import getLatLng from '../reducers/getLatLng';
import { newPlaceHighlighted } from '../actions/PlaceActions';
import { mouseMoved } from '../actions/MapActions';
import Map from '../components/Map';

const mapStateToProps = state => {
  const selectedPlace = getSelectedPlace(state);
  const places = state.places.placeTypes && state.places.placeTypes[state.places.activePlaceType] ?
    state.places.placeTypes[state.places.activePlaceType].map(place => {
      return {
        id: place.id,
        name: place.name,
        polygons: place.coordinates.map(polygon => {
          return polygon.map(polygonCoords => {
            return {
              lat: polygonCoords[1],
              lng: polygonCoords[0]
            };
          })
        })
      }
    })
    : [];
  return {
    center: selectedPlace ? 
      getLatLng(selectedPlace.center) : 
      getLatLng([-98.5795, 39.8283]),
    places: places
  };
}

const mapDispatchToProps = dispatch => {
  return {
    mouseOverPlace: (polygonId) => {
      dispatch(newPlaceHighlighted(polygonId));
    },
    mouseOutPlace: () => {
      dispatch(newPlaceHighlighted(''));
    },
    mapMouseMoved: (event) => {
      console.log("Got mouse mouse");
      dispatch(mouseMoved(event.latLng));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
