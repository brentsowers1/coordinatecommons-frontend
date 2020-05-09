import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
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
              Email address:
              <input type='text'onChange={(event, newValue) => this.setState({email: newValue})} required />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input type='password' onChange={(event, newValue) => this.setState({password: newValue})} required />
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
