import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CognitoAuth from '../classes/CognitoAuth';
import { useHistory } from 'react-router-dom';

const Signin = (props) => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cognitoError, setCognitoError] = useState(null); 
  
  const handleSubmit = (event) => {
    event.preventDefault();
    CognitoAuth.signin(
      username, 
      password,
      handleLoginSuccessCallback,
      handleLoginFailureCallback);
  }

  const handleLoginSuccessCallback = () => {
    setCognitoError(null);
    history.push('/');
  }

  const handleLoginFailureCallback = (err) => {
    setCognitoError(err.message);
  }

  return (
    <Container>
      <h1>Sign In To Coordinate Commons</h1>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col md={2}>
            <label htmlFor='username'>Username:</label>
          </Col>
          <Col md={3}>
            <input type='text' name='username' onChange={(e) => setUsername(e.target.value)} required />
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <label htmlFor='password'>Password:</label>
          </Col>
          <Col md={3}>
            <input type='password' name='password' onChange={(e) => setPassword(e.target.value)} required />
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <input type='submit' value='Log in' />
          </Col>
        </Row>
      </form>
      {cognitoError ? 
        <div>
          <div>Error attempting to log in:</div>
          <div>{cognitoError}</div>
        </div> : ''
      }
      <div>
        Don't have an account? <Link to='/signup'>Sign Up Here!</Link>
      </div>
    </Container>
  );
}

export default Signin;
