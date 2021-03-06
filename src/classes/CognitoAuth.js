import LoggedInUser from './LoggedInUser';
import config from '../config';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

class CognitoAuth {
  constructor() {
    const poolData = {
      UserPoolId: config.cognito.userPoolId,
      ClientId: config.cognito.userPoolClientId
    };    
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    if (typeof window.AWSCognito !== 'undefined') {
      window.AWSCognito.config.region = config.cognito.region;
    }
    this.registerLoggedInUserChangeCallbacks = [];
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
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);    
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: this.localAuthenticationSuccessCallback.bind(this, successCallback, failureCallback),
      onFailure: failureCallback
    });
  }

  logout() {
    if (LoggedInUser.isLoggedIn) {
      const cognitoUser = getCognitoUser(this.userPool, LoggedInUser.username);
      cognitoUser.signOut();
      LoggedInUser.isLoggedIn = false;
      this.registerLoggedInUserChangeCallbacks.map(c => c());      
    }
  }

  registerLoggedInUserChangeCallback(loggedInUserChangeCallback) {
    this.registerLoggedInUserChangeCallbacks.push(loggedInUserChangeCallback);
  }

  localAuthenticationSuccessCallback(successCallback, errorCallback, result) {
    const accessToken = result.getIdToken().getJwtToken();
    const payload = result.getIdToken().decodePayload();
    LoggedInUser.isLoggedIn = true;
    LoggedInUser.token = accessToken;
    LoggedInUser.username = payload['cognito:username'];
    LoggedInUser.email = payload['email'];
    LoggedInUser.location = payload['custom:location'];
    LoggedInUser.sub = payload['sub'];
    console.log(`Successfully logged in user ${LoggedInUser.username}`);
    console.log(`Token is ${accessToken}`);
    this.registerLoggedInUserChangeCallbacks.map(c => c());

    successCallback();
  }
  
};

const getCognitoUser = (pool, username) => {
  return new AmazonCognitoIdentity.CognitoUser({
    Username: username,
    Pool: pool
  });
};  

const generateDataAttribute = (attributeName, attributeValue) => {
  return new AmazonCognitoIdentity.CognitoUserAttribute({
    Name: attributeName,
    Value: attributeValue
  });
};



export default CognitoAuth = new CognitoAuth();
