import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
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
  }

  render() {
    return (
      <Container>
        <h1>Sign In To Coordinate Commons</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>
              Username:
              <input type='text'onChange={(e) => this.setState({username: e.target.value})} required />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input type='password' onChange={(e) => this.setState({password: e.target.value})} required />
            </label>
          </div>
        </form>
        <div>
          Don't have an account? <Link to='/signup'>Sign Up Here!</Link>
        </div>

      </Container>
    );
  }
};

export default Signin;
