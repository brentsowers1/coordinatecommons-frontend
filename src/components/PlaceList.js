import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

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

  onPlaceClick(place) {
    this.setState({selectedPlaceId: place.id});
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.placeType !== this.props.placeType) {
      this.setState({selectedPlaceId: null});
    }
  }

  render() {
    return (
      <ListGroup>
        {this.props.places.map(place =>
          <ListGroup.Item
            action={place.id !== this.state.selectedPlaceId}
            key={place.id}
            eventKey={place.id}
            active={place.id === this.state.selectedPlaceId}
            onClick={() => this.onPlaceClick(place)}>
            {place.name}
          </ListGroup.Item>
        )}
      </ListGroup>
    )
  }
}

export default PlaceList;
