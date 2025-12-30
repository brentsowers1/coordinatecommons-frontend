import React from 'react';
import { Link } from 'react-router-dom';

const SignInOrUpPrompt = () => (
  <React.Fragment>
    <Link to='/signin'>Sign In</Link> to permanently save places that you click on. If you do not have an account, <Link to='/signup'>Sign Up</Link>!
  </React.Fragment>
);

export default SignInOrUpPrompt;