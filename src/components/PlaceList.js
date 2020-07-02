import React from 'react';
import { getPlaceTypeLastWord } from '../util/name-utils';
import { Container, Row, Col } from 'react-bootstrap';

const PlaceList = (props) => {
  const visitedPlaces = props.places.filter(p => p.visited);
  const placeTypeName = getPlaceTypeLastWord(props.placeType);
  return (
    <Container>
      <Row>
        <Col md={6}>
          <p><u>Visited {placeTypeName}</u></p>
        </Col>
        <Col md={6}>
          <p><u>Unvisited {placeTypeName}</u></p>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          {visitedPlaces.map(p => 
            <div key={p.id}>{p.name}</div>
          )}
        </Col>
        <Col md={6}>
          {props.places.filter(p => !p.visited).map(p => 
            <div key={p.id}>{p.name}</div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceList;
