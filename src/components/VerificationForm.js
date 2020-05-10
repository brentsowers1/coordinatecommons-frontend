import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

const VerificationForm = (props) => {
  const [email, setEmail] = useState(props.email);
  const [code, setCode] = useState('');

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      props.onSubmit(email, code);
    }}>
      <Row>
        <Col md={5}>
          Registration successful. Please check your email inbox or spam folder for your verification code, enter it below, and submit.
        </Col>  
      </Row>  
      <Row>
        <Col md={2}>
          <label htmlFor='email'>Email Address:</label>
        </Col>
        <Col md={3}>
          <input name='email' type='text' value={email} onChange={(event, newValue) => setEmail(newValue)} required />
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <label htmlFor='code'>Verification Code:</label><br />
        </Col>
        <Col md={3}>
          <input name='code' type='text' onChange={(event, newValue) => setCode(newValue)} required />
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <input type='submit' value='Verify' />
        </Col>
      </Row>
    </form>
  );
};

export default VerificationForm;