import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PlaceList from './PlaceList';
import Map from '../containers/Map';
import './Places.css';

class Places extends Component {
  componentWillMount() {
    this.props.placeTypeChanged(this.props.activePlaceType);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col sm={4} md={3} lg={3} xl={2} className="no-float">
            <PlaceList
              places={this.props.places}
              selectedPlaceId={this.props.selectedPlaceId}
              onPlaceClick={this.props.onPlaceClick} />
          </Col>
          <Col sm={8} md={9} lg={9} xl={10} className="no-float">
            <Map />
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Places;
