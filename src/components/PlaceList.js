import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

class PlaceList extends Component {
  static propTypes = {
    places: PropTypes.array.isRequired,
    selectedPlaceId: PropTypes.string,
    onPlaceClick: PropTypes.func.isRequired
  }

  render() {
    return (
      <ListGroup>
        {this.props.places.map(place =>
          <ListGroup.Item
            action={place.id !== this.props.selectedPlaceId}
            key={place.id}
            eventKey={place.id}
            active={place.id === this.props.selectedPlaceId}
            onClick={() => this.props.onPlaceClick(place)}>
            {place.name}
          </ListGroup.Item>
        )}
      </ListGroup>
    )
  }
}

export default PlaceList;
