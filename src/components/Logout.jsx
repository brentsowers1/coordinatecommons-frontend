import CognitoAuth from '../classes/CognitoAuth';
import { useNavigate } from "react-router-dom";
import { useIsLoggedIn, useUsername } from '../sharedState/LoggedInUser';

const Logout = () => {
  const [isLoggedIn, setIsLoggedIn] = useIsLoggedIn();
  const [username] = useUsername();
  const navigate = useNavigate();

  if (isLoggedIn) {
    CognitoAuth.logout(username);
    setIsLoggedIn(false);
  }
  navigate('/');
  return (
    <div></div>
  );
};

export default Logout;
