import loadJs from '../util/loadJs';

export default class Map {
  constructor(mapContainerId, geoJsonUrl, callbacks) {
    // This is necessary so that we can have any number of map instances
    if (window.googleMapInstanceCounter) {
      window.googleMapInstanceCounter++;
    } else {
      window.googleMapInstanceCounter = 1;
    }

    this.googleMap = null;
    this.geoJsonUrl = geoJsonUrl;
    this.mapContainerId = mapContainerId;
    this.callbacks = callbacks;

    const baseUrl = 'https://maps.googleapis.com/maps/api/js';
    const mapKey = 'AIzaSyDRY1U5VsSThTsCbLZm0AeH-j5xCfuAewc'; 

    // When initializing the map, we need to know what the instance number is, and what map container to load the map
    // in. So bind the 'this' value when this callback is executed to the 'this' value right now (this instance of
    // the class)
    window[`initMap${window.googleMapInstanceCounter}`] = this.initMap.bind(this, null);
    if (window.google && window.google.maps) {
      // And all that for nothing if the google maps Javascript code is already loaded... None of this would be necessary
      // if the script is loaded synchronously.
      this.initMap();
    } else {
      loadJs(`${baseUrl}?key=${mapKey}&callback=initMap${window.googleMapInstanceCounter}`);
    }
  }

  // This probably is not necessary, but just incase, explicitly set the global variables to null
  destroy() {
    window[`initMap${this.instanceNumber}`] = null;    
  }

  initMap(geoJsonUrl) {
    if (geoJsonUrl) {
      this.geoJsonUrl = geoJsonUrl;
    }
    // initMap will get called twice - once on the google maps callback after the script is loaded, and when the React
    // component that includes this class is mounted. places will only be set on the React component's mount, but, when that
    // is mounted, the google Javascript MAY not be loaded. 
    if (window.google && window.google.maps) {
      this.googleMap = new window.google.maps.Map(document.getElementById(this.mapContainerId), {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 5
      });
      this.googleMap.data.loadGeoJson(this.geoJsonUrl, null, (features) => {
        if (this.callbacks.onMapInitialized) {
          this.callbacks.onMapInitialized();
        }
      });
      this.googleMap.data.setStyle(setFeatureStyle);
      this.googleMap.data.addListener('click', (event) => {
        if (this.callbacks && this.callbacks.onClick) {
          this.callbacks.onClick(event.feature.getId());
        }
      });
      this.googleMap.data.addListener('mouseover', (event) => {
        event.feature.setProperty('mousedOver', true);
        if (this.callbacks && this.callbacks.onMouseOver) {
          this.callbacks.onMouseOver(event.feature.getId());
        }
      });
      this.googleMap.data.addListener('mouseout', (event) => {
        event.feature.setProperty('mousedOver', false);
        if (this.callbacks && this.callbacks.onMouseOver) {
          this.callbacks.onMouseOut(event.feature.getId());
        }
      });
    }
  }

  toggleFeatureSelected(featureId) {
    if (this.googleMap) {
      const mapFeature = this.googleMap.data.getFeatureById(featureId);
      if (mapFeature) {
        mapFeature.setProperty('selected', !mapFeature.getProperty('selected'));
      }
    }
  }
  
  setCenter(place) {
    if (this.googleMap) {
      this.googleMap.setCenter(getLatLng(place.center));
    }
  }
  
}

const setFeatureStyle = (feature) => {
  const fillColor = feature.getProperty('selected') ? '#11FF11' : '#AAAAAA';
  const strokeWeight = feature.getProperty('mousedOver') ? 5 : 2;
  return {
    strokeColor: "#000000",
    strokeOpacity: 0.8,
    strokeWeight,
    fillColor,
    fillOpacity: 0.25    
  };
}

const getLatLng = (lngLatArray) => {
  return {
    lat: lngLatArray[1], 
    lng: lngLatArray[0]
  };
}
