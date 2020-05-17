import LoggedInUser from './LoggedInUser';
import axios from 'axios';
import config from '../config';

class ApiClient {

  saveVisit(placeId, visited, placeType, successCallback, errorCallback) {
    axios({
      method: 'post',
      url: getUrl('/visit'),
      data: { placeId, placeType, visited },
      headers: headers()
    }).then((response) => {
      console.log('Successfully saved visit');
      successCallback(response.data);
    }).catch((err) => {
      console.error('Error saving visit:');
      console.error(err);
      errorCallback(err);
    });
  }

  getVisitedPlaces(placeType, successCallback, errorCallback) {
    axios({
      method: 'get',
      url: getUrl('/visit'),
      params: {
        placeType
      },
      headers: headers()
    }).then((response) => {
      console.log('Got visited places');
      successCallback(response.data);
    }).catch((err) => {
      console.error('Error getting visited places:');
      console.error(err);
      errorCallback(err);
    });
  }

}

const headers = () => {
  return {
    Authorization: LoggedInUser.token
  };
}

const getUrl = (path) => `${config.lambdaBaseUrl}${path}`

export default ApiClient = new ApiClient();
