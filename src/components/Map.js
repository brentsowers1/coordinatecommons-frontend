import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap
} from "react-google-maps";
import { compose, withProps } from "recompose";
import { connect } from "react-redux";
import getSelectedPlace from '../reducers/getSelectedPlace';

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
    zoom={props.zoom}
    center={props.center}
  >

  </GoogleMap>
));

const mapStateToProps = state => {
  const selectedPlace = getSelectedPlace(state);
  return {
    center: selectedPlace ? selectedPlace.center : {lat: 40, lng:-77},
    zoom: selectedPlace ? selectedPlace.zoom : 8
  }
}

export default connect(mapStateToProps)(Map);
