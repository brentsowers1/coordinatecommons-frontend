import React from 'react';
import printPercent from '../util/printPercent';
import { getPlaceTypeLastWord } from '../util/place-type-name-utils';
import { Container, Row, Col } from 'react-bootstrap';

const PlaceList = (props) => {
  const visitedPlaces = props.places.filter(p => p.visited);
  const placeTypeName = getPlaceTypeLastWord(props.placeType);
  return (
    <Container>
      <Row>
        <Col md={12}>
          You've visited {visitedPlaces.length} out of {props.places.length} {placeTypeName} - 
            &nbsp;{printPercent(visitedPlaces.length, props.places.length)}                
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          Visited {placeTypeName}
        </Col>
        <Col md={6}>
          Unvisited {placeTypeName}
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
