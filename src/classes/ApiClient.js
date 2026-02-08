import axios from 'axios';
import config from '../config';

class ApiClient {

  saveVisit(token, placeId, visited, placeType, successCallback, errorCallback) {
    axios({
      method: 'post',
      url: getUrl('/visit'),
      data: { placeId, placeType, visited },
      headers: headers(token)
    }).then((response) => {
      console.log('Successfully saved visit');
      successCallback(response.data);
    }).catch((err) => {
      console.error('Error saving visit:', err);
      if (errorCallback) {
        errorCallback(err);
      }
    });
  }

  getVisitedPlaces(token, placeType, userSub, successCallback, errorCallback) {
    const request = {
      method: 'get',
      params: {}
    }
    if (placeType) {
      request.params.placeType = placeType;
    }
    if (userSub) {
      request.params.sub = userSub;
      request.url = getUrl('/visit-public');
    } else {
      request.headers = headers(token)
      request.url = getUrl('/visit');
    }
    axios(request).then((response) => {
      console.log('Got visited places');
      successCallback(response.data);
    }).catch((err) => {
      console.error('Error getting visited places:', err);
      if (errorCallback) {
        errorCallback(err);
      }
    });
  }

  saveUserAttributes(token, attributes, successCallback, errorCallback) {
    axios({
      method: 'post',
      url: getUrl('/user-attribute'),
      data: attributes,
      headers: headers(token)
    }).then(() => {
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

  getUserAttributes(token, username, successCallback, errorCallback) {
    const request = {
      method: 'get',
      params: {}
    }
    if (username) {
      request.params.username = username;
      request.url = getUrl('/user-attribute-public');
    } else {
      request.headers = headers(token)
      request.url = getUrl('/user-attribute');
    }
    axios(request).then((res) => {
      console.log('Got user attributes');
      if (successCallback) {
        successCallback(res.data);
      }
    }).catch((err) => {
      console.error('Error getting user attributes:', err);
      if (errorCallback) {
        errorCallback(err);
      }
    });
  }
}

const headers = (token) => {
  return {
    Authorization: token
  };
}

const getUrl = (path) => `${config.lambdaBaseUrl}${path}`

export default new ApiClient();
