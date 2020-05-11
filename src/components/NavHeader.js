import React, { useState } from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";

const NavHeader = () => {
  const history = useHistory();
  //const [isLoggedin, setIsLoggedIn] = getState(false);

  return (
    <Navbar>
      <Container>
        <Navbar.Brand>
          <Link to="/">Coordinate Commons</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Nav onSelect={handleNavSelect.bind(this, history)}>
          <Nav.Item>
            <Nav.Link eventKey='/about'>About</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey='/mypage'>My Page</Nav.Link>
          </Nav.Item>
          <NavDropdown title="Places" id="places-dropdown">
            <NavDropdown.Item eventKey='/places/us-state'>
              US States
            </NavDropdown.Item>
            <NavDropdown.Item eventKey='/places/canada-state'>
              Canadian Provinces
            </NavDropdown.Item>
            <NavDropdown.Item eventKey='/places/country'>
              Countries
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Item>
            <Nav.Link eventKey='/signin'>Sign In</Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar> 
  );
}

const handleNavSelect = (history, eventKey) => {
  history.push(eventKey);
}


export default NavHeader;
