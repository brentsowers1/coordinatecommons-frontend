const generateState = (id, name, center, zoom) => {
  return {
    id: id, 
    name: name,
    center: center,
    zoom: zoom,
    type: 'STATE'
  };
}

const initialState = {
  allPlaces: [
    generateState('DC', 'Washington, DC', {lat:38.9072, lng:-77.0369}, 11),
    generateState('MD', 'Maryland', {lat:39.0458, lng:-76.6413}, 8),
    generateState('PA', 'Pennsylvania', {lat:41.2033, lng:-77.1945}, 7),
    generateState('VA', 'Virginia', {lat:37.4316, lng:-78.6569}, 7)
  ],
  selectedPlaceId: 'VA',
  activePlaceType: 'STATE'
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
    default:
      return state;
  }
}

export default places;
