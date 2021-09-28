import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PlaceList from './PlaceList';
import SignInOrUpPrompt from './SignInOrUpPrompt';
import './Places.css';
import axios from 'axios';
import Map from '../classes/Map';
import { getYouveOrUserHas, getFullProperPlaceType } from '../util/name-utils';
import printPercent from '../util/printPercent';
import ApiClient from '../classes/ApiClient';
import { useIsLoggedIn, useToken } from '../sharedState/LoggedInUser';
import useAsyncReference from '../util/useAsyncRef';

// I tried making this class a functional component. But because of the callbacks that are needed for maps (when
// polygons are clicked), and auth (when logged in), the only way I could get things to work was a lot of hacks, 
// using refs, and getting around the concept of local state. The end result was bad and flaky. The class based
// component is fine and works great. Other than the binding to this being confusing, I think a class based 
// component for something complex like this component is best, better than a functional component with 
// providers, reducers, etc

const PlacesFunctional = (props) => {
  const [places, setPlaces] = useAsyncReference([]);
  const [placeType] = useState(props.match.params.placeType ? props.match.params.placeType : 'us-state');
  const prevPlaceType = useRef(placeType);
  const [mouseOverPlace, setMouseOverPlace] = useState(null);
  const [lambdaResponse, setLambdaResponse] = useState(null);
  const [isLoggedIn] = useIsLoggedIn();
  const [token] = useToken();
  const [username] = useState(props.match.params.username);
  const prevUsername = useRef(username);
  const [userAttributes, setUserAttributes] = useState(null);
  const map = useRef(null);
  const firstRenderForMap = useRef(true);
  const firstRenderForVisitedPlaces = useRef(true);

  // Catches if the username is manually changed in the URL, blank out the user attributes
  useEffect(() => {
    if (props.match.params.username !== username) {
      setUserAttributes(null);
  }
  }, [username, props.match.params.username]);
  
  const isMyPlaces = () => {
    return (!username || username === 'my');
  }  

  const getDataBaseUrl = () => {
    return `${process.env.PUBLIC_URL}/data/${placeType}`;
  }

  const getPlacesAndInitMap = () => {
    axios.get(`${getDataBaseUrl()}-data.json`).then(rsp => {
        setPlaces(rsp.data);
        getVisitedPlaces();
      })
      .catch(err => {
        console.log(`Error getting place data ${placeType}`, err);
      });
    map.current.initMap(placeType);
  }

  // TODO - maybe this would be better as a function outside of the component that takes everything in as parameters?
  // So have it take isLoggedIn, username, token, placeType, userAttributes, etc?
  // or make this a useEffect, listening for places to be changed?
  const getVisitedPlaces = () => {
    if (isLoggedIn && isMyPlaces()) {
      ApiClient.getVisitedPlaces(token, placeType, null, getVisitedPlacesSuccessCallback);
    } else if (!isMyPlaces()) {
      if (!userAttributes) {
        ApiClient.getUserAttributes(token, username, 
          (response) => {
            setUserAttributes(response);
            // Todo - user attributes are still null when this function runs. Either make it a ref or pass it around
            getVisitedPlacesForOtherUser();
          });
      } else {
        getVisitedPlacesForOtherUser();
      }
    }
  }

  const getVisitedPlacesForOtherUser = () => {
    // TODO: Add toggling of public access
    ApiClient.getVisitedPlaces(token, placeType, userAttributes.UserId, getVisitedPlacesSuccessCallback);
  }

  const getVisitedPlacesSuccessCallback = (response) => {
    const visitedPlacesHash = response.placesVisited.reduce((hash, curPlace) => {
      hash[curPlace.Id] = true;
      map.current.toggleFeatureSelected(curPlace.Id, true);
      return hash;
    }, {});
    const newPlaces = [...places.current];
    newPlaces.forEach(place => {
      place.visited = visitedPlacesHash[place.id] === true; 
    });
    setPlaces(newPlaces);
  }

  // Load the map the first time
  useEffect(() => {
    if (!map.current) {
        map.current = new Map('map', `${process.env.PUBLIC_URL}/data`, placeType, mapCallbacks);
    }
    if (firstRenderForMap.current) {
      getPlacesAndInitMap();
      firstRenderForMap.current = false;
    }
  }, [placeType, map]);

  // This catches if the URL is manually set
  useEffect(() =>  {
    if (prevPlaceType.current !== placeType || prevUsername.current !== username) {
      getPlacesAndInitMap();
      prevPlaceType.current = placeType;
      prevUsername.current = username;
    }
  }, [placeType, username]);

  useEffect(() => {
    if (!firstRenderForVisitedPlaces.current) {
      getVisitedPlaces();
      firstRenderForVisitedPlaces.current = false;
    }
  }, [isLoggedIn]);

  const onMapPolygonMouseOver = (id) => {
    setMouseOverPlace(getPlaceFromId(id));
  }

  const onMapPolygonMouseOut = (id) => {
    setMouseOverPlace(null);
  }

  const onMapDataReloaded = () => {
    places.current.forEach(place => {
      if (place.visited) {
        map.current.toggleFeatureSelected(place.id, true);
      }
    });
  }

  const onMapPolygonClick = (id) => {
    if (isMyPlaces()) {
      map.current.toggleFeatureSelected(id);
      const newPlaces = [...places.current];
      const foundPlace = newPlaces.find(p => p.id === id);
      if (foundPlace) {
        foundPlace.visited = !foundPlace.visited;
        setPlaces(newPlaces);
        if (isLoggedIn) {
          ApiClient.saveVisit(token, id, foundPlace.visited, placeType, 
            (response) => {
              const message = `Successfully called lambda to ${response.visited ? 'save' : 'remove'} visit for place ID ${response.placeId} for user ${response.username}!`;
              setLambdaResponse(message);
            },
            (err) => {
              const message = `Error calling the lambda. Check the console for details`;
              setLambdaResponse(message);
            });
        }
      }
    }
  }

  const mapCallbacks = {
    onMouseOver: onMapPolygonMouseOver,
    onMouseOut: onMapPolygonMouseOut,
    onClick: onMapPolygonClick,
    onDataReloaded: onMapDataReloaded
  };  

  const getPlaceFromId = (id) => {
    return places.current.find(p => p.id === id);
  }

  const visitedPlaces = places.current.filter(p => p.visited);
  return (
    <Container>
      <Row>
        <Col>
          <h4 className='text-center'>
            {getYouveOrUserHas(username, true)} visited {visitedPlaces.length} out of {places.current.length}&nbsp;
            {getFullProperPlaceType(placeType, false)} - {printPercent(visitedPlaces.length, places.current.length)}
          </h4>          
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={12} lg={12} xl={12} className="no-float">
          <div style={{ height: '500px'}}>
            <div style={{ height: '100%' }} id='map'></div>
          </div>  
          <div>
            {mouseOverPlace ? 
              mouseOverPlace.name + (mouseOverPlace.visited ? ' - VISITED' : ' - NOT VISITED')
              : 
              ''}&nbsp;
          </div>
        </Col>
      </Row>
      {lambdaResponse ? 
        <Row>
          <Col md={12}>
            {lambdaResponse}
          </Col>
        </Row>
        : 
        ''
      }
      {
        isMyPlaces() ?
          <Row>
            <Col md={12}>
              Click on the map to mark that you've visited that place. Click on My Places at the top for different types of places.<br />
              {isLoggedIn ? '' : 
                <SignInOrUpPrompt />
              }
            </Col>
          </Row>
        :
          ''
      }        
      <hr />
      <Row>
        <Col sm={12} md={12} lg={12} xl={12} className="no-float">
          <PlaceList
            isMyPlaces={isMyPlaces()}
            username={username}
            places={places.current}
            placeType={placeType}
          />
        </Col>          
      </Row>
    </Container>
  );
};

export default PlacesFunctional;
