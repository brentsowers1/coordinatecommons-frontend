import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import config from '../config';
import SignupForm from './SignupForm';
import VerificationForm from './VerificationForm';

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cognitoError: null,
      cognitoSignupSuccess: false,
      cognitoVerificationSuccess: false
    };
    this.initializeCognito();
  }

  initializeCognito() {
    const poolData = {
      UserPoolId: config.cognito.userPoolId,
      ClientId: config.cognito.userPoolClientId
    };    
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    if (typeof window.AWSCognito !== 'undefined') {
      window.AWSCognito.config.region = config.cognito.region;
    }  
  }

  handleSignupSubmit(email, alias, location, password) {
    const attributes = [
      generateDataAttribute('email', email),
      generateDataAttribute('custom:alias', alias),
      generateDataAttribute('custom:Location', location)
    ];

    this.userPool.signUp(email, password, attributes, null, this.signupCallback.bind(this));
  }

  signupCallback(err, result) {
    if (err && err.message) {
      console.log("Cognito error:");
      console.log(err);
      this.setState({
        cognitoError: err.message,
        cognitoSignupSuccess: false
      });
    } else {
      this.setState({
        cognitoError: null,
        cognitoSignupSuccess: true
      });
    }
  }

  handleVerificationSubmit(email, code) {
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: this.userPool
    });
    cognitoUser.confirmRegistration(code, true, this.verificationCallback.bind(this));
  }

  verificationCallback(err, result) {
    if (err && err.message) {
      console.log("Cognito error:");
      console.log(err);
      this.setState({
        cognitoError: err.message,
        cognitoVerificationSuccess: false
      });      
    } else {
      this.setState({
        cognitoError: null,
        cognitoVerificationSuccess: true
      });
    }    
  }

  render() {
    return (
      <Container>
        <h1>Sign Up For Coordinate Commons</h1>        
        <div>
          Already have an account? <Link to='/signin'>Sign In Here!</Link>
        </div>
        {this.state.cognitoVerificationSuccess ?
          <div>Successfully signed up and verified! Please <Link to='/signin'>Sign In</Link> with your email address and password.</div>
          : 
          this.state.cognitoSignupSuccess ?
            <VerificationForm onSubmit={this.handleVerificationSubmit.bind(this)} />
            :
            <SignupForm onSubmit={this.handleSignupSubmit.bind(this)} />
        }
        <Row>
          <Col md={5}>
            {this.state.cognitoError ? 
              <div>
                <div>Error attempting to create account:</div>
                <div>{this.state.cognitoError}</div>
              </div> : ''
            }
          </Col>
        </Row>        
      </Container>
    );
  }
};

const generateDataAttribute = (attributeName, attributeValue) => {
  return new AmazonCognitoIdentity.CognitoUserAttribute({
    Name: attributeName,
    Value: attributeValue
  });
};

export default Signup;
