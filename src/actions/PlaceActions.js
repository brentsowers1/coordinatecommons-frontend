import axios from 'axios';

export function placeClicked(place) {
  return {
      type: 'PLACE_CLICKED',
      place
  }
}

export function placeTypeChanged(placeType) {
  console.log("placeTypeChanged to ", placeType);
  return function (dispatch) {
    axios.get(`${process.env.PUBLIC_URL}/data/${placeType}.json`)
      .then(rsp => {
        console.log("Got data, placeType = ", placeType);
        dispatch(placeDataRetrieved(rsp.data, placeType));
      })
      .catch(err => {
        console.log(`Error getting place data ${placeType}`, err);
      })
  }
}

function placeDataRetrieved(placeData, placeType) {
  return {
    type: 'PLACE_DATA_RETRIEVED',
    payload: {
      placeType,
      placeData
    }
  };
}
