export default function(state) {
  console.log("Getting selected place with", state);
  const placeTypes = state.places.placeTypes;
  const activePlaceType = state.places.activePlaceType;
  console.log("placeTypes = ", placeTypes);
  console.log("activePlaceType = ", activePlaceType);
  console.log("active places = ", placeTypes[activePlaceType]);
  return (placeTypes && placeTypes[activePlaceType] ? 
    placeTypes[activePlaceType].find(x => x.id === state.places.selectedPlaceId) : 
    null);
}
