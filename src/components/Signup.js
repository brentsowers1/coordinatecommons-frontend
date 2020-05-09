import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      alias: '',
      location: '',
      password1: '',
      password2: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <Container>
        <h1>Sign Up For Coordinate Commons</h1>        
        <div>
          Already have an account? <Link to='/signin'>Sign In Here!</Link>
        </div>
        <form onSubmit={this.handleSubmit}>
          <Row>
            <Col md={2}>
              <label for='email'>Email Address:</label>
            </Col>
            <Col md={3}>
              <input name='email' type='text' onChange={(event, newValue) => this.setState({email: newValue})} required />
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <label for='alias'>Alias:</label><br />
              (what's shown publicly)
            </Col>
            <Col md={3}>
              <input name='alias' type='text' onChange={(event, newValue) => this.setState({alias: newValue})} required />
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <label for='location'>Location:</label><br />
              (optional)
            </Col>
            <Col md={3}>
              <input name='location' type='text' onChange={(event, newValue) => this.setState({location: newValue})} />
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <label for='password1'>Password:</label>
            </Col>
            <Col md={3}>
              <input name='password1' type='password' onChange={(event, newValue) => this.setState({password1: newValue})} required />
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <label for='password2'>Confirm Password:</label>
            </Col>
            <Col md={3}>
              <input name='password2' type='password' onChange={(event, newValue) => this.setState({password2: newValue})} required />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <input type='submit' value='Create Account' />
            </Col>
          </Row>
        </form>
      </Container>
    );
  }
};

export default Signup;
