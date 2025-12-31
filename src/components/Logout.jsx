import { useEffect } from 'react';
import CognitoAuth from '../classes/CognitoAuth';
import { useNavigate } from "react-router-dom";
import { useIsLoggedIn, useUsername } from '../sharedState/LoggedInUser';

const Logout = () => {
  const [isLoggedIn, setIsLoggedIn] = useIsLoggedIn();
  const [username] = useUsername();
  const navigate = useNavigate();

  // Perform logout and redirect as an effect to avoid updating state during render
  useEffect(() => {
    if (isLoggedIn) {
      CognitoAuth.logout(username);
      setIsLoggedIn(false);
    }
    navigate('/');
  }, [isLoggedIn, username, navigate, setIsLoggedIn]);

  return (
    <div></div>
  );
};

export default Logout;
