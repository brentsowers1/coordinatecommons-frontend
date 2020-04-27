import loadJs from '../util/loadJs';

export default class Map {
  constructor(mapContainerId) {
    // This is necessary so that we can have any number of map instances
    if (window.googleMapInstanceCounter) {
      window.googleMapInstanceCounter++;
    } else {
      window.googleMapInstanceCounter = 1;
    }

    this.googleMap = null;
    this.places = [];
    this.mapContainerId = mapContainerId;

    const baseUrl = 'https://maps.googleapis.com/maps/api/js';
    const mapKey = 'AIzaSyDRY1U5VsSThTsCbLZm0AeH-j5xCfuAewc'; 

    // When initializing the map, we need to know what the instance number is, and what map container to load the map
    // in. So bind the 'this' value when this callback is executed to the 'this' value right now (this instance of
    // the class)
    window[`initMap${window.googleMapInstanceCounter}`] = this.initMap.bind(this, null);
    if (window.google && window.google.maps) {
      // And all that for nothing if the google maps Javascript code is already loaded... None of this would be necessary
      // if the script is loaded synchronously.
      this.initMap(this.places, this.mapContainerId);
    } else {
      loadJs(`${baseUrl}?key=${mapKey}&callback=initMap${window.googleMapInstanceCounter}`);
    }
  }

  // This probably is not necessary, but just incase, explicitly set the global variables to null
  destroy() {
    window[`initMap${this.instanceNumber}`] = null;    
  }

  initMap(places) {
    // initMap will get called twice - once on the google maps callback after the script is loaded, and when the React
    // component that includes this class is mounted. places will only be set on the React component's mount, but, when that
    // is mounted, the google Javascript MAY not be loaded. 
    if (places) {
      this.places = places;
    }
    if (window.google && window.google.maps) {
      this.googleMap = new window.google.maps.Map(document.getElementById(this.mapContainerId), {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 5
      });
      this.loadPlacesOnMap(this.places);
    }
  }
  
  loadPlacesOnMap(places) {
    this.places = places;
  }
  
  setCenter(place) {
    this.googleMap.setCenter(getLatLng(place.center));
  }
  
}

const getLatLng = function (lngLatArray) {
  return {
    lat: lngLatArray[1], 
    lng: lngLatArray[0]
  };
}
