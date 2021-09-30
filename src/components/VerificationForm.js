import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

const VerificationForm = (props) => {
  const [username, setUsername] = useState(props.username);
  const [code, setCode] = useState('');

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      props.onSubmit(username, code);
    }}>
      <Row className="extra-padding">
        {props.transitionFromSignup ?
          <Col md={12}>
            Registration successful. Please check your email inbox or spam folder for your verification code from no-reply@verificationemail.com, enter it below, and submit.
          </Col>
          :
          <Col md={12}>
            Please enter the email address you signed up with, and the verification code your received below.
          </Col>
       }
      </Row>  
      <Row className="extra-padding">
        <Col md={2}>
          <label htmlFor='email'>Username:</label>
        </Col>
        <Col md={3}>
          <input name='email' type='text' value={username} onChange={(e) => setUsername(e.target.value)} required />
        </Col>
      </Row>
      <Row className="extra-padding">
        <Col md={2}>
          <label htmlFor='code'>Verification Code:</label><br />
        </Col>
        <Col md={3}>
          <input name='code' type='text' onChange={(e) => setCode(e.target.value)} required />
        </Col>
      </Row>
      <Row className="extra-padding">
        <Col md={3}>
          <input type='submit' value='Verify' />
        </Col>
      </Row>
    </form>
  );
};

export default VerificationForm;