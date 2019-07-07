// const generatePlace = (id, name, center, zoom, placeType) => {
//   return {
//     id: id, 
//     name: name,
//     center: center,
//     zoom: zoom,
//     type: placeType
//   };
// }

const initialState = {
  // allPlaces: [
  //   generatePlace('DC', 'Washington, DC', {lat:38.9072, lng:-77.0369}, 11, 'us-state'),
  //   generatePlace('MD', 'Maryland', {lat:39.0458, lng:-76.6413}, 8, 'us-state'),
  //   generatePlace('PA', 'Pennsylvania', {lat:41.2033, lng:-77.1945}, 7, 'us-state'),
  //   generatePlace('VA', 'Virginia', {lat:37.4316, lng:-78.6569}, 7, 'us-state'),
  //   generatePlace('USA', 'United States', {lat:37.0902, lng:-95.7129}, 4, 'country'),
  //   generatePlace('CA', 'Canada', {lat:56.1304, lng:-106.3468}, 3, 'country'),
  //   generatePlace('MX', 'Mexico', {lat:23.6345, lng:-102.5528}, 5, 'country'),
  //   generatePlace('UK', 'United Kingdom', {lat:55.3781, lng:-3.4360}, 5, 'country')    
  // ],
  placeTypes: {
    "us-state": [

    ],
    "country": [
      
    ]
  },
  selectedPlaceId: 'VA',
  activePlaceType: 'us-state'
}

const places = (state=initialState, action) => {
  switch (action.type) {
    case 'PLACE_CLICKED':
      if (state.selectedPlaceId !== action.place.id) {
        return {
          ...state,
          selectedPlaceId: action.place.id
        };
      } else {
        return state;
      }
    case 'PLACE_DATA_RETRIEVED':
      console.log("place data retrieved - ", action);
      var placeTypes = {
        ...state.placeTypes
      };
      placeTypes[action.payload.placeType] = action.payload.placeData;
      console.log("placetypes set to ", placeTypes);
      return {
        ...state,
        activePlaceType: action.payload.placeType,
        placeTypes: placeTypes
      };
    default:
      return state;
  }
}

export default places;
