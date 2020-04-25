export function mouseMoved(latLng) {
  return {
    type: 'MOUSE_MOVED',
    payload: {
      lat: latLng.lat(),
      lng: latLng.lng()
    }
  }
}