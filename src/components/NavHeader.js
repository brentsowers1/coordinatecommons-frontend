import React from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';

const NavHeader = () => (
  <Navbar>
    <Container>
      <Navbar.Brand>
        <Link to="/">Coordinate Commons</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Nav>
        <LinkContainer to="/about">
          <Nav.Item>About</Nav.Item>
        </LinkContainer>
        <LinkContainer to="/mypage">
          <Nav.Item>My Page</Nav.Item>
        </LinkContainer>
        <NavDropdown title="Places" id="places-dropdown">
          <LinkContainer to="/places/us-state">
            <NavDropdown.Item eventKey={2.1}>US States</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/places/canada-state">
            <NavDropdown.Item eventKey={2.2}>Canadian Provinces</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/places/country">
            <NavDropdown.Item eventKey={2.3}>Countries</NavDropdown.Item>
          </LinkContainer>
        </NavDropdown>
      </Nav>
    </Container>
  </Navbar> 
);

export default NavHeader;
