const generateState = (id, name) => {
  return {id: id, name: name, type: 'STATE'};
}

const initialState = {
  allPlaces: [
    generateState('DC', 'Washington, DC'),
    generateState('MD', 'Maryland'),
    generateState('PA', 'Pennsylvania'),
    generateState('VA', 'Virginia')
  ],
  selectedPlaceId: '',
  activePlaceType: 'STATE'
}

const places = (state=initialState, action) => {
  switch (action.type) {
    case 'PLACE_CLICKED':
      if (state.selectedPlaceId !== action.place.id) {
        return Object.assign({}, state, {
          selectedPlaceId: action.place.id
        });
      } else {
        return state;
      }
    default:
      return state;
  }
}

export default places;
