import loadJs from '../util/loadJs';

export default class Map {
  constructor(mapContainerId) {
    // Since the google load map function is globally called as a callback without knowledge of this Map class, we have
    // to keep track of all of our instances in a global array so that way when the load callback happens, we know
    // which class instance to use to store local variables. This allows any number of these map classes to be
    // initialized
    if (!window.googleMapInstances) {
      window.googleMapInstances = [];
    }
    window.googleMapInstances.push(this);

    this.instanceNumber = window.googleMapInstances.length - 1;
    this.googleMap = null;
    this.places = [];
    this.mapContainerId = mapContainerId;

    // When initializing the map, we need to know what the instance number is, and what map container to load the map
    // in. So bind these values to the function that the google callback will call.
    window[`initMap${this.instanceNumber}`] = this.initMap.bind(this, null, this.mapContainerId, this.instanceNumber);
    if (window.google && window.google.maps) {
      // And all that for nothing if the google maps Javascript code is already loaded... None of this would be necessary
      // if the script is loaded synchronously.
      this.initMap(this.places, this.mapContainerId);
    } else {
      loadJs(`https://maps.googleapis.com/maps/api/js?key=AIzaSyDRY1U5VsSThTsCbLZm0AeH-j5xCfuAewc&callback=initMap${this.instanceNumber}`)
    }
  }

  // This probably is not necessary, but just incase, explicitly set the global variables to null
  destroy() {
    window.googleMapInstances[this.instanceNumber] = null;
    window[`initMap${this.instanceNumber}`] = null;    
  }

  initMap(places, mapContainerId, globalOffsetInstanceToUse) {
    // This function can EITHER get called explicitly on an instance of this Map class, or as a Google callback when 
    // the Javascript loads. If it's called from the callback, "this" will be window, not the class. We store all
    // created instances of this class in window.googleMapInstances, and when this is called as a callback, the 
    // globalOffset variable is bound. If it's called directly on an instance of the Map class, then nothing special
    // needs to be done.
    const correctThis = globalOffsetInstanceToUse === undefined ? this : window.googleMapInstances[globalOffsetInstanceToUse];
    debugger
    if (places) {
      correctThis.places = places;
    }
    if (window.google && window.google.maps) {
      correctThis.googleMap = new window.google.maps.Map(document.getElementById(mapContainerId), {
        center: {lat: 39.8283, lng: -98.5795},
        zoom: 5
      });
      correctThis.loadPlacesOnMap(correctThis.places);
    }
  }
  
  loadPlacesOnMap(places) {
    this.places = places;
    console.log('loading places');
  }
  
  setMapCenter(place) {
    this.googleMap.setCenter(getLatLng(place.center));
  }
  
}

const getLatLng = function (lngLatArray) {
  return {
    lat: lngLatArray[1], 
    lng: lngLatArray[0]
  };
}
