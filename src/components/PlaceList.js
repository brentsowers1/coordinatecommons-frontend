import React, { Component } from 'react';
import PropTypes from 'prop-types';
import printPercent from '../util/printPercent';
import { getPlaceTypeLastWord } from '../util/place-type-name-utils';
import { Container, Row, Col } from 'react-bootstrap';

class PlaceList extends Component {
  static propTypes = {
    placeType: PropTypes.string.isRequired,
    places: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedPlaceId: null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.placeType !== this.props.placeType) {
      this.setState({selectedPlaceId: null});
    }
  }

  getVisitedPlaces() {
    return this.props.places.filter(p => p.visited);
  }

  render() {
    const placeTypeName = getPlaceTypeLastWord(this.props.placeType);
    return (
      <Container>
        <Row>
          <Col md={12}>
            You've visited {this.getVisitedPlaces().length} out of {this.props.places.length} {placeTypeName} - 
              &nbsp;{printPercent(this.getVisitedPlaces().length, this.props.places.length)}                
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
            {this.getVisitedPlaces().map(p => 
              <div>{p.name}</div>
            )}
          </Col>
          <Col md={6}>
            {this.props.places.filter(p => !p.visited).map(p => 
              <div>{p.name}</div>
            )}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default PlaceList;
