import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SignupForm from './SignupForm';
import VerificationForm from './VerificationForm';
import CognitoAuth from '../classes/CognitoAuth';

const Signup = (props) => {
  const [cognitoError, setCognitoError] = useState(null);
  const [loadVerificationPage, setLoadVerificationPage] = useState(props.verify === true);
  const [cognitoSignupSuccess, setCognitoSignupSuccess] = useState(false);
  const [cognitoVerificationSuccess, setCognitoVerificationSuccess] = useState(false);
  const [username, setUsername] = useState('');

  const handleSignupSubmit = (formUsername, formEmail, formLocation, formPassword) => {
    setUsername(formUsername);
    CognitoAuth.signup(formUsername, formEmail, formLocation, formPassword, signupCallback);
  }
   
  const signupCallback = (err, result) => {
    if (err && err.message) {
      console.log("Cognito error:");
      console.log(err);
      setCognitoError(err.message);
      setCognitoSignupSuccess(false);
      setLoadVerificationPage(false);
    } else {
      setCognitoError(null);
      setCognitoSignupSuccess(true);
      setLoadVerificationPage(true);
    }
  }
    
  const handleVerificationSubmit = (username, code) => {
    CognitoAuth.verify(username, code, verificationCallback);
  }
    
  const verificationCallback = (err, result) => {
    if (err && err.message) {
      console.log("Cognito error:");
      console.log(err);
      setCognitoError(err.message);
      setCognitoVerificationSuccess(false);
    } else {
      setCognitoError(null);
      setCognitoVerificationSuccess(true);
    }    
  }
    
  return (
    <Container>
      <h1>Sign Up For Coordinate Commons</h1>        
      <div>
        Already have an account? <Link to='/signin'>Sign In Here!</Link>
      </div>
      {loadVerificationPage ? '' : 
        <div>
          Already signed up and have a verification code? <Link to='/verify'>Enter It Here!</Link>
        </div>
      }
      {cognitoVerificationSuccess ?
        <div>Successfully signed up and verified! Please <Link to='/signin'>Sign In</Link> with your email address and password.</div>
        : 
        loadVerificationPage ?
          <VerificationForm 
            onSubmit={handleVerificationSubmit}
            username={username}
            transitionFromSignup={cognitoSignupSuccess} />
          :
          <SignupForm 
            onSubmit={handleSignupSubmit} />
      }
      <Row>
        <Col md={5}>
          {cognitoError ? 
            <div>
              <div>Error attempting to create account:</div>
              <div>{cognitoError}</div>
            </div> : ''
          }
        </Col>
      </Row>        
    </Container>
  );
};

export default Signup;
