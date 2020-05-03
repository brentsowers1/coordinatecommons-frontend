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
      placeType: props.match.params.placeType ? props.match.params.placeType : 'us-state',
      mouseOverPlace: null
    };
    const callbacks = {
      onMouseOver: this.onMapPolygonMouseOver.bind(this),
      onMouseOut: this.onMapPolygonMouseOut.bind(this),
      onClick: this.onMapPolygonClick.bind(this),
      onMapInitialized: this.onMapInitialized.bind(this)
    };
    this.map = new Map('map', this.getGeoJsonUrl(), callbacks);
  }

  componentDidMount() {
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
    
  }

  onMapPolygonClick(id) {

  }

  onMapInitialized() {
    this.map.setFeatureClicked('AL');
  }

  getPlaceFromId(id) {
    return this.state.places.find(p => p.id === id);
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
            <div>
              {this.state.mouseOverPlace? this.state.mouseOverPlace.name : ''}
            </div>                
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Places;
