import React from 'react';
import CognitoAuth from '../classes/CognitoAuth';
import { useHistory } from "react-router-dom";

const Logout = (props) => {
  const history = useHistory();
  CognitoAuth.logout();
  history.push('/');
  return (
    <div></div>
  );
};

export default Logout;