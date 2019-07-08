import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polygon
} from "react-google-maps";
import { compose, withProps } from "recompose";
import { connect } from "react-redux";
import getSelectedPlace from '../reducers/getSelectedPlace';
import getLatLng from '../reducers/getLatLng';

const Map = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDRY1U5VsSThTsCbLZm0AeH-j5xCfuAewc",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    zoom={5}
    center={props.center}
  >
    {props.polygons.map(polygon => 
      <Polygon
        key={polygon.id}
        path={polygon.coordinates}
        options={{
          strokeColor: "#000000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#111111",
          fillOpacity: 0.1
        }}
      />
    )}  
  </GoogleMap>
));

const mapStateToProps = state => {
  const selectedPlace = getSelectedPlace(state);
  const polygons = state.places.placeTypes && state.places.placeTypes[state.places.activePlaceType] ?
    state.places.placeTypes[state.places.activePlaceType].map(place => {
      return {
        id: place.id,
        coordinates: place.coordinates[0].map(polygonCoords => {
          return {
            lat: polygonCoords[1],
            lng: polygonCoords[0]};
          }
        )
      };
    })
    : [];
  console.log("polygons - ", polygons);
  return {
    center: selectedPlace ? 
      getLatLng(selectedPlace.center) : 
      getLatLng([-98.5795, 39.8283]),
    polygons: polygons
  };
}

export default connect(mapStateToProps)(Map);
