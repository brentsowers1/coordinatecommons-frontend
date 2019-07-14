import { connect } from "react-redux";
import getSelectedPlace from '../reducers/getSelectedPlace';
import getLatLng from '../reducers/getLatLng';
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
  console.log("places - ", places);
  return {
    center: selectedPlace ? 
      getLatLng(selectedPlace.center) : 
      getLatLng([-98.5795, 39.8283]),
    places: places
  };
}

export default connect(mapStateToProps)(Map);
