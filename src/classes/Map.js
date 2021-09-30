import loadJs from '../util/loadJs';
import config from '../config';

export default class Map {
  constructor(mapContainerId, geoJsonUrlBase, placeType, callbacks) {
    // This is necessary so that we can have any number of map instances
    if (window.googleMapInstanceCounter) {
      window.googleMapInstanceCounter++;
    } else {
      window.googleMapInstanceCounter = 1;
    }

    this.googleMap = null;
    this.geoJsonUrlBase = geoJsonUrlBase;
    this.placeType = placeType;
    this.mapContainerId = mapContainerId;
    this.callbacks = callbacks;
    this.zoom = 5;

    const baseUrl = 'https://maps.googleapis.com/maps/api/js';

    // When initializing the map, we need to know what the instance number is, and what map container to load the map
    // in. So bind the 'this' value when this callback is executed to the 'this' value right now (this instance of
    // the class)
    window[`initMap${window.googleMapInstanceCounter}`] = this.initMap.bind(this, null);
    if (window.google && window.google.maps) {
      // And all that for nothing if the google maps Javascript code is already loaded... None of this would be necessary
      // if the script is loaded synchronously.
      this.initMap();
    } else {
      loadJs(`${baseUrl}?key=${config.googleMapsApiKey}&callback=initMap${window.googleMapInstanceCounter}`);
    }
  }

  // This probably is not necessary, but just incase, explicitly set the global variables to null
  destroy() {
    window[`initMap${this.instanceNumber}`] = null;    
  }

  updateCallbacks(callbacks) {
    this.callbacks = callbacks;
  }

  initMap(placeType) {
    if (placeType) {
      this.placeType = placeType;
    }
    // initMap will get called twice - once on the google maps callback after the script is loaded, and when the React
    // component that includes this class is mounted. places will only be set on the React component's mount, but, when that
    // is mounted, the google Javascript MAY not be loaded. 
    if (window.google && window.google.maps) {
      this.googleMap = new window.google.maps.Map(document.getElementById(this.mapContainerId), {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 5
      });
      this.zoom = 5;
      this.googleMap.addListener('zoom_changed', () => {
        const oldGeoJsonUrl = this.geoJsonUrl();
        this.zoom = this.googleMap.getZoom();
        const newGeoJsonUrl = this.geoJsonUrl();
        if (oldGeoJsonUrl !== newGeoJsonUrl) {
          this.googleMap.data.forEach((feature) => {
            this.googleMap.data.remove(feature);  
          });
          this.googleMap.data.loadGeoJson(newGeoJsonUrl, null, () => {
            if (this.callbacks && this.callbacks.onDataReloaded) {
              this.callbacks.onDataReloaded();
            }
          });
        }
      });
      this.googleMap.data.loadGeoJson(this.geoJsonUrl(), null, () => {
        if (this.callbacks && this.callbacks.onDataReloaded) {
          this.callbacks.onDataReloaded();
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

  // isSelected is optional - if you pass it, it will set the feature to that value (true or false). If not passed in,
  // the feature will be toggled from the prior value
  toggleFeatureSelected(featureId, isSelected) {
    if (this.googleMap) {
      const mapFeature = this.googleMap.data.getFeatureById(featureId);
      if (mapFeature) {
        mapFeature.setProperty('selected', 
          isSelected === undefined ? !mapFeature.getProperty('selected') : isSelected === true);
      }
    }
  }
  
  setCenter(place) {
    if (this.googleMap) {
      this.googleMap.setCenter(getLatLng(place.center));
    }
  }

  geoJsonUrl() {
    return `${this.geoJsonUrlBase}/${this.placeType}-${getPrecision(this.placeType, this.zoom)}-geojson.json`;  
  }
}

const getPrecision = (placeType, zoomLevel) => {
  switch (placeType) {
    case 'country':
      return zoomLevel < 7 ? 'medium' : 'large';
    case 'us-state':
      return zoomLevel < 8 ? 'medium' : 'large';
    case 'canada-state':
      return zoomLevel < 8 ? 'medium' : 'large';
    default:
      return 'medium';
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
