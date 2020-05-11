import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CognitoAuth from '../classes/CognitoAuth';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      cognitoError: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    CognitoAuth.signin(
      this.state.username, 
      this.state.password,
      this.handleLoginSuccessCallback.bind(this),
      this.handleLoginFailureCallback.bind(this));
  }

  handleLoginSuccessCallback() {
    this.setState({cognitoError: null});
    
  }

  handleLoginFailureCallback(err) {
    this.setState({cognitoError: err.message});
  }

  render() {
    return (
      <Container>
        <h1>Sign In To Coordinate Commons</h1>
        <form onSubmit={this.handleSubmit}>
          <Row>
            <Col md={2}>
              <label htmlFor='username'>Username:</label>
            </Col>
            <Col md={3}>
              <input type='text' name='username' onChange={(e) => this.setState({username: e.target.value})} required />
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <label htmlFor='password'>Password:</label>
            </Col>
            <Col md={3}>
              <input type='password' name='password' onChange={(e) => this.setState({password: e.target.value})} required />
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <input type='submit' value='Log in' />
            </Col>
          </Row>
        </form>
        {this.state.cognitoError ? 
          <div>
            <div>Error attempting to log in:</div>
            <div>{this.state.cognitoError}</div>
          </div> : ''
        }
        <div>
          Don't have an account? <Link to='/signup'>Sign Up Here!</Link>
        </div>
      </Container>
    );
  }
};

export default Signin;
