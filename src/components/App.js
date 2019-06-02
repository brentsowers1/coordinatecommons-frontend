import React from 'react';
import { Container, Row, Col, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import ActivePlaceList from '../containers/ActivePlaceList';
//import Map from '../components/Map';
import './App.css';

const App = () => (
  <React.Fragment>
    <Navbar>
      <Container>
        <Navbar.Brand>
          <a href="/">Coordinate Commons</a>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Nav>
          <Nav.Link eventKey={1} href="#">My Page</Nav.Link>
          <NavDropdown eventKey={2} title="Maps" id="maps-dropdown">
            <NavDropdown.Item eventKey={2.1}>States</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
    <Container>
      <Row>
        <Col sm={3} md={3} lg={2} className="no-float">
          <ActivePlaceList />
        </Col>
        <Col sm={9} md={9} lg={10} className="no-float map-column">
          <div style={{height: '100%'}}>
            <div className="buffer">&nbsp;</div>
            {//<Map />
            }
          </div>
        </Col>
      </Row>
    </Container>
  </React.Fragment>
);

export default App;
