import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PlaceList from './PlaceList';
import './Places.css';
import axios from 'axios';

class Places extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      placeType: props.match.params.placeType ? props.match.params.placeType : 'us-state'
    };
  }

  componentDidMount() {
    this.getPlaces();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.placeType && nextProps.match.params.placeType !== prevState.placeType) {
      return {placeType: nextProps.match.params.placeType}
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
        console.log("Got data, placeType = ", this.state.placeType);
        this.setState({places: rsp.data});
      })
      .catch(err => {
        console.log(`Error getting place data ${this.state.placeType}`, err);
      })
  }

  render() {
    return (
      <Container>
        <Row>
          <Col sm={4} md={3} lg={3} xl={2} className="no-float">
            <PlaceList
              places={this.state.places}
              placeType={this.state.placeType}
            />
          </Col>
          <Col sm={8} md={9} lg={9} xl={10} className="no-float">
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
