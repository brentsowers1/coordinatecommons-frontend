import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SignupForm from './SignupForm';
import VerificationForm from './VerificationForm';
import CognitoAuth from '../classes/CognitoAuth';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cognitoError: null,
      loadVerificationPage: props.verify === true,
      cognitoSignupSuccess: false,
      cognitoVerificationSuccess: false,
      username: ''
    };
  }

  handleSignupSubmit(username, email, location, password) {
    this.setState({username: username});
    CognitoAuth.signup(username, email, location, password, this.signupCallback.bind(this));
  }

  signupCallback(err, result) {
    if (err && err.message) {
      console.log("Cognito error:");
      console.log(err);
      this.setState({
        cognitoError: err.message,
        cognitoSignupSuccess: false,
        loadVerificationPage: false
      });
    } else {
      this.setState({
        cognitoError: null,
        cognitoSignupSuccess: true,
        loadVerificationPage: true
      });
    }
  }

  handleVerificationSubmit(username, code) {
    CognitoAuth.verify(username, code, this.verificationCallback.bind(this));
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
        {this.state.loadVerificationPage ? '' : 
          <div>
            Already signed up and have a verification code? <Link to='/verify'>Enter It Here!</Link>
          </div>
        }
        {this.state.cognitoVerificationSuccess ?
          <div>Successfully signed up and verified! Please <Link to='/signin'>Sign In</Link> with your email address and password.</div>
          : 
          this.state.loadVerificationPage ?
            <VerificationForm 
              onSubmit={this.handleVerificationSubmit.bind(this)}
              username={this.state.username}
              transitionFromSignup={this.state.cognitoSignupSuccess} />
            :
            <SignupForm 
              onSubmit={this.handleSignupSubmit.bind(this)} />
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

export default Signup;
