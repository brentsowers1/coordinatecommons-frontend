import LoggedInUser from './LoggedInUser';
import axios from 'axios';
import config from '../config';

class ApiClient {

  savePlace(placeId, successCallback, errorCallback) {
    axios({
      method: 'post',
      url: getUrl('/place'),
      data: { placeId: placeId },
      headers: headers()
    }).then((response) => {
      console.log('Success calling savePlace');
      console.log(response);
      successCallback(response.data);
    }).catch((err) => {
      console.error('Error calling savePlace:');
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
