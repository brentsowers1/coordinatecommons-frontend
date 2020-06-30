import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PlaceList from './PlaceList';
import './Places.css';
import axios from 'axios';
import Map from '../classes/Map';
import { getFullProperPlaceType } from '../util/place-type-name-utils';
import ApiClient from '../classes/ApiClient';
import LoggedInUser from '../classes/LoggedInUser';
import CognitoAuth from '../classes/CognitoAuth';

// I tried making this class a functional component. But because of the callbacks that are needed for maps (when
// polygons are clicked), and auth (when logged in), the only way I could get things to work was a lot of hacks, 
// using refs, and getting around the concept of local state. The end result was bad and flaky. The class based
// component is fine and works great. Other than the binding to this being confusing, I think a class based 
// component for something complex like this component is best, better than a functional component with 
// providers, reducers, etc

class Places extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      placeType: props.match.params.placeType ? props.match.params.placeType : 'us-state',
      mouseOverPlace: null,
      lambdaResponse: null,
      isLoggedIn: LoggedInUser.isLoggedIn
    };
    this.callbacks = {
      onMouseOver: this.onMapPolygonMouseOver.bind(this),
      onMouseOut: this.onMapPolygonMouseOut.bind(this),
      onClick: this.onMapPolygonClick.bind(this),
      onDataReloaded: this.onMapDataReloaded.bind(this)
    };
  
    CognitoAuth.registerLoggedInUserChangeCallback(this.loggedInCallback.bind(this));    
  }

  componentDidMount() {
    if (!this.map) {
      this.map = new Map('map', `${process.env.PUBLIC_URL}/data`, this.state.placeType, this.callbacks);
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

  loggedInCallback() {
    this.setState({isLoggedIn: LoggedInUser.isLoggedIn});
    this.getVisitedPlaces();
  };  

  getDataBaseUrl() {
    return `${process.env.PUBLIC_URL}/data/${this.state.placeType}`;
  }

  getPlacesAndInitMap() {
    axios.get(`${this.getDataBaseUrl()}-data.json`).then(rsp => {
        this.setState({places: rsp.data});
        this.getVisitedPlaces();
      })
      .catch(err => {
        console.log(`Error getting place data ${this.state.placeType}`, err);
      });
    this.map.initMap(this.state.placeType);
  }

  getVisitedPlaces() {
    if (LoggedInUser.isLoggedIn) {
      ApiClient.getVisitedPlaces(this.state.placeType, null,
        (response) => {
          const visitedPlacesHash = response.placesVisited.reduce((hash, curPlace) => {
            hash[curPlace.Id] = true;
            this.map.toggleFeatureSelected(curPlace.Id);
            return hash;
          }, {});
          const newPlaces = [...this.state.places];
          newPlaces.forEach(place => {
            place.visited = visitedPlacesHash[place.id] === true; 
          });
          this.setState({places: newPlaces});
        },
        (err) => {
          console.error('Couldn\'t get visited places');
        }  
      )
    }
  }

  onMapPolygonMouseOver(id) {
    this.setState({mouseOverPlace: this.getPlaceFromId(id)});
  }

  onMapPolygonMouseOut(id) {
    this.setState({mouseOverPlace: null});
  }

  onMapDataReloaded() {
    this.state.places.forEach(place => {
      if (place.visited) {
        this.map.toggleFeatureSelected(place.id);
      }
    });
  }

  onMapPolygonClick(id) {
    this.map.toggleFeatureSelected(id);
    const newPlaces = [...this.state.places];
    const foundPlace = newPlaces.find(p => p.id === id);
    if (foundPlace) {
      foundPlace.visited = !foundPlace.visited;
      this.setState({places: newPlaces});
      if (LoggedInUser.isLoggedIn) {
        ApiClient.saveVisit(id, foundPlace.visited, this.state.placeType, 
          (response) => {
            const message = `Successfully called lambda to ${response.visited ? 'save' : 'remove'} visit for place ID ${response.placeId} for user ${response.username}!`;
            this.setState({lambdaResponse: message});
          },
          (err) => {
            const message = `Error calling the lambda. Check the console for details`;
            this.setState({lambdaResponse: message});
          });
      }
    }
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
        {this.state.lambdaResponse ? 
          <Row>
            <Col md={12}>
              {this.state.lambdaResponse}
            </Col>
          </Row>
          : 
          ''
        }
        {this.state.isLoggedIn ?
          <Row>
            <Col md={12}>
              Click on a place to mark that you've visited that place.
            </Col>
          </Row>          
          :
          <Row>
            <Col md={12}>
              <Link to='/signin'>Sign In</Link> to permanently save places that you click on. If you do not have an account, <Link to='/signup'>Sign Up</Link>!
            </Col>
          </Row>
        }        
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
