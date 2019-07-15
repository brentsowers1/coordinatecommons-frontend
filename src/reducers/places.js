const initialState = {
  placeTypes: {
    'us-state': [],
    'canada-state': [],
    'country': []
  },
  selectedPlaceId: 'VA',
  highlightedPlaceId: '',
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
    case 'PLACE_HIGHLIGHTED':
      return {
        ...state,
        highlightedPlaceId: action.payload.placeId
      }
    default:
      return state;
  }
}

export default places;
