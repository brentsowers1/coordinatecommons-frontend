import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PlaceList from './PlaceList';
import './Places.css';
import axios from 'axios';
import Map from '../classes/Map';

class Places extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      placeType: props.match.params.placeType ? props.match.params.placeType : 'us-state'
    };
    this.map = new Map('map');
  }

  componentDidMount() {
    this.getPlaces();
    this.map.initMap(this.state.places);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.placeType && nextProps.match.params.placeType !== prevState.placeType) {
      return { placeType: nextProps.match.params.placeType }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.placeType !== this.state.placeType) {
      this.getPlaces();
    }
  }

  getPlaces() {
    axios.get(`${process.env.PUBLIC_URL}/data/${this.state.placeType}.json`)
      .then(rsp => {
        this.setState({places: rsp.data}, () => this.map.loadPlacesOnMap(this.state.places));
      })
      .catch(err => {
        console.log(`Error getting place data ${this.state.placeType}`, err);
      })
  }

  onPlaceClick(place) {
    this.map.setCenter(place);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col sm={4} md={3} lg={3} xl={2} className="no-float">
            <PlaceList
              places={this.state.places}
              placeType={this.state.placeType}
              onPlaceClick={(place) => this.onPlaceClick(place)}
            />
          </Col>
          <Col sm={8} md={9} lg={9} xl={10} className="no-float">
            <div style={{ height: '500px'}}>
              <div style={{ height: '100%' }} id='map'></div>
            </div>                  
            {/* <ActiveMap />
            <HighlightedPlaceInfo />
            <MousePosition /> */}
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Places;
