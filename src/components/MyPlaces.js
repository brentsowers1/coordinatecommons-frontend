import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ActivePlaceList from '../containers/ActivePlaceList';
import Map from '../containers/Map';
import './MyPlaces.css';

const MyPlaces = () => (
  <Container>
    <Row>
      <Col sm={4} md={3} lg={3} xl={2} className="no-float">
        <ActivePlaceList />
      </Col>
      <Col sm={8} md={9} lg={9} xl={10} className="no-float">
        <Map />
      </Col>
    </Row>
  </Container>
);

export default MyPlaces;
