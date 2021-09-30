import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

const SignupForm = (props) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [password1, setPassword1] = useState(''); 
  const [password2, setPassword2] = useState('');
  const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      localFormSubmit(username, email, location, password1, password2, setPasswordsDontMatch, props.onSubmit);
    }}>  
      <Row className="extra-padding">
        <Col md={3}>
          <label htmlFor='alias'>Username (shown publicly):</label>
        </Col>
        <Col md={3}>
          <input name='alias' type='text' onChange={(e) => setUsername(e.target.value)} required />
        </Col>
      </Row>
      <Row className="extra-padding">
        <Col md={3}>
          <label htmlFor='email'>Email Address:</label>
        </Col>
        <Col md={3}>
          <input name='email' type='text' onChange={(e) => setEmail(e.target.value)} required />
        </Col>
      </Row>
      <Row className="extra-padding">
        <Col md={3}>
          <label htmlFor='location'>Location (optional):</label>
        </Col>
        <Col md={3}>
          <input name='location' type='text' onChange={(e) => setLocation(e.target.value)} />
        </Col>
      </Row>
      <Row className="extra-padding">
        <Col md={3}>
          <label htmlFor='password1'>Password:</label>
        </Col>
        <Col md={3}>
          <input name='password1' type='password' onChange={(e) => setPassword1(e.target.value)} required />
        </Col>
      </Row>
      <Row className="extra-padding">
        <Col md={3}>
          <label htmlFor='password2'>Confirm Password:</label>
        </Col>
        <Col md={3}>
          <input name='password2' type='password' onChange={(e) => setPassword2(e.target.value)} required />
          {passwordsDontMatch ? 
            <div>Passwords do not match, please correct and submit again</div>
            : ''}
        </Col>
      </Row>
      <Row className="extra-padding">
        <Col md={3}>
          <input type='submit' value='Create Account' />
        </Col>
      </Row>
    </form>
  );
};

const localFormSubmit = (username, email, location, password1, password2, setPasswordsDontMatch, onSubmit) => {
  if (password1 !== password2) {
    setPasswordsDontMatch(true);
    return;
  } else {
    setPasswordsDontMatch(false);
    onSubmit(username, email, location, password1);
  }
}

export default SignupForm;