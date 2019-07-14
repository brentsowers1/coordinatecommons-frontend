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
    {props.places.map(place =>
      place.polygons.map((polygon, index) =>
        <Polygon
          key={`${polygon.id}-${index}`}
          path={polygon}
          options={{
            strokeColor: "#000000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#111111",
            fillOpacity: 0.1
          }}
        />
      ))}  
  </GoogleMap>
));

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
