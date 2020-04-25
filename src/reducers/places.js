const initialState = {
  placeTypes: {
    'us-state': [],
    'canada-state': [],
    'country': []
  },
  selectedPlaceId: 'VA',
  highlightedPlaceId: '',
  activePlaceType: 'us-state',
  mouseLocation: {lat: 0, lng: 0}
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
    case 'PLACE_HIGHLIGHTED':
      return {
        ...state,
        highlightedPlaceId: action.payload.placeId
      }
    case 'MOUSE_MOVED':
      return {
        ...state,
        mouseLocation: {
          lat: action.payload.lat,
          lng: action.payload.lng
        }
      }
    default:
      return state;
  }
}

export default places;
