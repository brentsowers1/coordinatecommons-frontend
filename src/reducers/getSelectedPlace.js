export default function(state) {
  return (state.places.allPlaces ? state.places.allPlaces.find(x => x.id === state.places.selectedPlaceId) : null);
}
