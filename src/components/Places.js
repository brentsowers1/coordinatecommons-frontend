import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PlaceList from './PlaceList';
import './Places.css';
import axios from 'axios';
import Map from '../classes/Map';
import { getFullProperPlaceType } from '../util/place-type-name-utils';

class Places extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      placeType: props.match.params.placeType ? props.match.params.placeType : 'us-state',
      mouseOverPlace: null
    };
    this.callbacks = {
      onMouseOver: this.onMapPolygonMouseOver.bind(this),
      onMouseOut: this.onMapPolygonMouseOut.bind(this),
      onClick: this.onMapPolygonClick.bind(this),
      onMapInitialized: this.onMapInitialized.bind(this)
    };
  }

  componentDidMount() {
    if (!this.map) {
      this.map = new Map('map', this.getGeoJsonUrl(), this.callbacks);
    }
    this.getPlacesAndInitMap();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.placeType && nextProps.match.params.placeType !== prevState.placeType) {
      return { placeType: nextProps.match.params.placeType }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.placeType !== this.state.placeType) {
      this.getPlacesAndInitMap();
    }
  }

  getDataBaseUrl() {
    return `${process.env.PUBLIC_URL}/data/${this.state.placeType}`;
  }


  getGeoJsonUrl() {
    return `${this.getDataBaseUrl()}-medium-geojson.json`;
  }

  getPlacesAndInitMap() {
    axios.get(`${this.getDataBaseUrl()}-data.json`).then(rsp => {
        this.setState({places: rsp.data});
      })
      .catch(err => {
        console.log(`Error getting place data ${this.state.placeType}`, err);
      });
    this.map.initMap(this.getGeoJsonUrl());
  }

  onPlaceClick(place) {
    this.map.setCenter(place);
  }

  onMapPolygonMouseOver(id) {
    this.setState({mouseOverPlace: this.getPlaceFromId(id)});
  }

  onMapPolygonMouseOut(id) {
    this.setState({mouseOverPlace: null});
  }

  onMapPolygonClick(id) {
    const newPlaces = [...this.state.places];
    const foundPlace = newPlaces.find(p => p.id === id);
    if (foundPlace) foundPlace.visited = !foundPlace.visited;
    this.setState({places: newPlaces});
    this.map.toggleFeatureSelected(id);
  }

  onMapInitialized() {

  }

  getPlaceFromId(id) {
    return this.state.places.find(p => p.id === id);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            {getFullProperPlaceType(this.state.placeType)}
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={12} xl={12} className="no-float">
            <div style={{ height: '500px'}}>
              <div style={{ height: '100%' }} id='map'></div>
            </div>  
            <div>
              {this.state.mouseOverPlace ? this.state.mouseOverPlace.name : ''}&nbsp;
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={12} xl={12} className="no-float">
            <PlaceList
              places={this.state.places}
              placeType={this.state.placeType}
            />
          </Col>          
        </Row>
      </Container>
    );
  }
};

export default Places;
