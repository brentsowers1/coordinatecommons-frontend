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
      console.error('Error saving visit:', err);
      errorCallback(err);
    });
  }

  getVisitedPlaces(placeType, userSub, successCallback, errorCallback) {
    const request = {
      method: 'get',
      params: {
        placeType
      }
    }
    if (userSub) {
      request.params.sub = userSub;
      request.url = getUrl('/visit-public');
    } else {
      request.headers = headers()
      request.url = getUrl('/visit');
    }
    axios(request).then((response) => {
      console.log('Got visited places');
      successCallback(response.data);
    }).catch((err) => {
      console.error('Error getting visited places:', err);
      errorCallback(err);
    });
  }

  saveUserAttributes(attributes, successCallback, errorCallback) {
    axios({
      method: 'post',
      url: getUrl('/user-attribute'),
      data: attributes,
      headers: headers()
    }).then((response) => {
      console.log('Successfully saved user attributes');
      if (successCallback) {
        successCallback();
      }
    }).catch((err) => {
      console.error('Error saving user attributes:', err);
      if (errorCallback) {
        errorCallback(err);
      }
    });    
  }

  getUserAttributes(username, successCallback, errorCallback) {
    const request = {
      method: 'get',
      params: {}
    }
    if (username) {
      request.params.username = username;
      request.url = getUrl('/user-attribute-public');
    } else {
      request.headers = headers()
      request.url = getUrl('/user-attribute');
    }
    axios(request).then((response) => {
      console.log('Got user attributes');
      successCallback(response.data);
    }).catch((err) => {
      console.error('Error getting user attributes:', err);
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
