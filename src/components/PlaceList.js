import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import printPercent from '../util/printPercent';
import getPlaceTypeName from '../util/getPlaceTypeName';
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

  // onPlaceClick(place) {
  //   this.setState({selectedPlaceId: place.id});
  //   if (this.props.onPlaceClick) {
  //     this.props.onPlaceClick(place)
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.placeType !== this.props.placeType) {
      this.setState({selectedPlaceId: null});
    }
  }

  getVisitedPlaces() {
    return this.props.places.filter(p => p.visited);
  }

  render() {
    const placeTypeName = getPlaceTypeName(this.props.placeType);
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
      // <ListGroup>
      //   {this.props.places.map(place =>
      //     <ListGroup.Item
      //       action={place.id !== this.state.selectedPlaceId}
      //       key={place.id}
      //       eventKey={place.id}
      //       active={place.id === this.state.selectedPlaceId}
      //       onClick={() => this.onPlaceClick(place)}>
      //       {place.name}
      //     </ListGroup.Item>
      //   )}
      // </ListGroup>
    )
  }
}

export default PlaceList;
