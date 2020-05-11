import LoggedInUser from './LoggedInUser';
import config from '../config';
//import * as AWS from 'aws-sdk/global';
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

  registerLoggedInUserChangeCallback(loggedInUserChangeCallback) {
    this.registerLoggedInUserChangeCallbacks.push(loggedInUserChangeCallback);
  }

  localAuthenticationSuccessCallback(successCallback, errorCallback, result) {
    const accessToken = result.getAccessToken().getJwtToken();
    /*window.AWS.config.region = config.cognito.region;
    const loginsObject = {};
    loginsObject[`cognito-idp.${config.cognito.region}.amazonaws.com/${config.cognito.userPoolId}`] = result.getIdToken().getJwtToken();
    window.AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: config.cognito.userPoolId,
      Logins: loginsObject
    });
    window.AWS.config.credentials.refresh((error) => {
      if (error) {
        errorCallback(error);
      } else {
        successCallback();
      }
    });*/
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
