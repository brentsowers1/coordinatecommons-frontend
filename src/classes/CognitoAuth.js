import config from '../config';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';

class CognitoAuth {
  constructor() {
    const poolData = {
      UserPoolId: config.cognito.userPoolId,
      ClientId: config.cognito.userPoolClientId
    };    
    this.userPool = new CognitoUserPool(poolData);
    if (typeof window.AWSCognito !== 'undefined') {
      window.AWSCognito.config.region = config.cognito.region;
    }
  }

  signup(username, email, location, password, signupCallback) {
    const attributes = [
      generateDataAttribute('email', email),
      generateDataAttribute('custom:location', location)
    ];

    this.userPool.signUp(username, password, attributes, null, signupCallback);    
  }

  verify(username, code, verifyCallback) {
    const cognitoUser = getCognitoUser(this.userPool, username);
    cognitoUser.confirmRegistration(code, true, verifyCallback);
  }

  signin(username, password, successCallback, failureCallback) {
    const cognitoUser = getCognitoUser(this.userPool, username);
    const authenticationData = {
      Username: username,
      Password: password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);    
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: this.localAuthenticationSuccessCallback.bind(this, successCallback, failureCallback),
      onFailure: failureCallback
    });
  }

  logout(username) {
    const cognitoUser = getCognitoUser(this.userPool, username);
    cognitoUser.signOut();
  }

  localAuthenticationSuccessCallback(successCallback, errorCallback, result) {
    const accessToken = result.getIdToken().getJwtToken();
    const payload = result.getIdToken().decodePayload();
    const username = payload['cognito:username'];
    console.log(`Successfully logged in user ${username}`);
    console.log(`Token is ${accessToken}`);

    successCallback(accessToken, username, payload['email'], payload['custom:location'], payload['sub']);
  }
  
};

const getCognitoUser = (pool, username) => {
  return new CognitoUser({
    Username: username,
    Pool: pool
  });
};  

const generateDataAttribute = (attributeName, attributeValue) => {
  return new CognitoUserAttribute({
    Name: attributeName,
    Value: attributeValue
  });
};

export default new CognitoAuth();
