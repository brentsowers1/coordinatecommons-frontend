import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useIsLoggedIn, useUsername } from '../sharedState/LoggedInUser';

const NavHeader = () => {
  const [isLoggedIn] = useIsLoggedIn();
  const [username] = useUsername();

  return (
    <Navbar>
      <Container>
        <Navbar.Brand>
          <Link to="/">Coordinate Commons</Link>
        </Navbar.Brand>
        <Nav>
          <Nav.Item>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/mypage/my">My Page</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <NavDropdown title="My Places" id="places-dropdown">
              <NavDropdown.Item as={Link} to="/places/my/us-state">US States</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/places/my/canada-state">Canadian Provinces</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/places/my/country">Countries</NavDropdown.Item>
            </NavDropdown>
          </Nav.Item>
          {isLoggedIn ?
            <Nav.Item>
              <Nav.Link as="span" className="nav-link">Welcome {username}! (<Nav.Link as={Link} to='/logout'>Log Out</Nav.Link>)</Nav.Link>
            </Nav.Item>          
            :
            <Nav.Item>
              <Nav.Link as={Link} to='/signin'>Sign In</Nav.Link>
            </Nav.Item>
          }
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavHeader;
