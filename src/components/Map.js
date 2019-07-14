import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polygon
} from "react-google-maps";
import { compose, withProps } from "recompose";

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

export default Map;
