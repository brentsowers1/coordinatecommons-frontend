import React from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";

const NavHeader = () => (
  <Navbar>
    <Container>
      <Navbar.Brand>
        <Link to="/">Coordinate Commons</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Nav>
        <Nav.Link eventKey={1} href="#">My Page</Nav.Link>
        <NavDropdown title="Places" id="places-dropdown">
          <NavDropdown.Item eventKey={2.1}>States</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Container>
  </Navbar> 
);

export default NavHeader;
