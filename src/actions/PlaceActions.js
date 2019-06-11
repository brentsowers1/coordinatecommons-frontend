export function placeClicked(place) {
  return {
      type: 'PLACE_CLICKED',
      place
  }
}

export function placeTypeChanged(placeType) {
  return {
    type: 'PLACE_TYPE_CHANGED',
    placeType
  }
}
