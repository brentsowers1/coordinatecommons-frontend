import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import Place from './Place'
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
          <Place
            id={place.id}
            name={place.name}
            selected={place.id === this.props.selectedPlaceId}
            onClick={() => this.props.onPlaceClick(place)} />
        )}
      </ListGroup>
    )
  }
}

export default PlaceList;
