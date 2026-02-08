import { Link } from 'react-router-dom';

const SignInOrUpPrompt = () => (
  <>
    <Link to='/signin'>Sign In</Link> to permanently save places that you click on. If you do not have an account, <Link to='/signup'>Sign Up</Link>!
  </>
);

export default SignInOrUpPrompt;