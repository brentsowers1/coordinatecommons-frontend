import CognitoAuth from '../classes/CognitoAuth';
import { useHistory } from "react-router-dom";
import { useIsLoggedIn, useUsername } from '../sharedState/LoggedInUser';

const Logout = () => {
  const [isLoggedIn, setIsLoggedIn] = useIsLoggedIn();
  const [username] = useUsername();
  const history = useHistory();

  if (isLoggedIn) {
    CognitoAuth.logout(username);
    setIsLoggedIn(false);
  }
  history.push('/');
  return (
    <div></div>
  );
};

export default Logout;
