import React from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import { useIsLoggedIn, useUsername } from '../sharedState/LoggedInUser';

const NavHeader = () => {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useIsLoggedIn();
  const [username] = useUsername();
  
  const handleNavSelect = (eventKey) => {
    history.push(eventKey);
  }

  return (
    <Navbar>
      <Container>
        <Navbar.Brand>
          <Link to="/">Coordinate Commons</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Nav onSelect={handleNavSelect}>
          <Nav.Item>
            <Nav.Link eventKey='/about'>About</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey='/mypage/my'>My Page</Nav.Link>
          </Nav.Item>
          <NavDropdown title="My Places" id="places-dropdown">
            <NavDropdown.Item eventKey='/places/my/us-state'>
              US States
            </NavDropdown.Item>
            <NavDropdown.Item eventKey='/places/my/canada-state'>
              Canadian Provinces
            </NavDropdown.Item>
            <NavDropdown.Item eventKey='/places/my/country'>
              Countries
            </NavDropdown.Item>
          </NavDropdown>
          {isLoggedIn ?
            <Nav.Item>
              Welcome {username}! (<Link to='/logout'>Log Out</Link>)
            </Nav.Item>          
            :
            <Nav.Item>
              <Nav.Link eventKey='/signin'>Sign In</Nav.Link>
            </Nav.Item>
          }
        </Nav>
      </Container>
    </Navbar> 
  );
}

export default NavHeader;
