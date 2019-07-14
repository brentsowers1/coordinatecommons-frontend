export default function(state) {
  const placeTypes = state.places.placeTypes;
  const activePlaceType = state.places.activePlaceType;
  return (placeTypes && placeTypes[activePlaceType] ? 
    placeTypes[activePlaceType].find(x => x.id === state.places.highlightedPlaceId) : 
    null);
}
