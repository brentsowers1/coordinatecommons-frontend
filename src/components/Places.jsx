import { useEffect, useRef, useState } from 'react';
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

const Places = (props) => {
  const [places, setPlaces] = useState([]);
  const [placeType, setPlaceType] = useState(props.match.params.placeType ? props.match.params.placeType : 'us-state');
  const prevPlaceType = useRef(placeType);
  const [mouseOverPlace, setMouseOverPlace] = useState(null);
  const [lambdaResponse, setLambdaResponse] = useState(null);
  const [isLoggedIn] = useIsLoggedIn();
  const [token] = useToken();
  const [username, setUsername] = useState(props.match.params.username);
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
    return `${import.meta.env.BASE_URL}data/${placeType}`;
  }

  const getPlacesAndInitMap = () => {
    axios.get(`${getDataBaseUrl()}-data.json`).then(rsp => {
        getVisitedPlaces(rsp.data);
      })
      .catch(err => {
        console.log(`Error getting place data ${placeType}`, err);
      });
    map.current.initMap(placeType);
  }

  const getVisitedPlaces = (placesOverride) => {
    if (isLoggedIn && isMyPlaces()) {
      ApiClient.getVisitedPlaces(token, placeType, null, 
        (response) => getVisitedPlacesSuccessCallback(response, placesOverride));
    } else if (!isMyPlaces()) {
      if (!userAttributes) {
        ApiClient.getUserAttributes(token, username, 
          (response) => {
            setUserAttributes(response);
            ApiClient.getVisitedPlaces(token, placeType, response.UserId, 
              (response) => getVisitedPlacesSuccessCallback(response, placesOverride));
          });
      } else {
        ApiClient.getVisitedPlaces(token, placeType, userAttributes.UserId, 
          (response) => getVisitedPlacesSuccessCallback(response, placesOverride));
      }
    } else if (placesOverride) {
      setPlaces(placesOverride);
    }
  }

  const getVisitedPlacesSuccessCallback = (response, placesOverride) => {
    const visitedPlacesHash = response.placesVisited.reduce((hash, curPlace) => {
      hash[curPlace.Id] = true;
      map.current.toggleFeatureSelected(curPlace.Id, true);
      return hash;
    }, {});
    const newPlaces = placesOverride ? [...placesOverride] : [...places];
    newPlaces.forEach(place => {
      place.visited = visitedPlacesHash[place.id] === true; 
    });
    setPlaces(newPlaces);
  }

  // Load the map the first time
  useEffect(() => {
    if (!map.current) {
        map.current = new Map('map', `${import.meta.env.BASE_URL}data`, placeType, mapCallbacks);
    }
    if (firstRenderForMap.current) {
      getPlacesAndInitMap();
      firstRenderForMap.current = false;
    }
  }, [placeType, map]);

  // This is needed to update the callbacks to the map class any time any state value changes,
  // since the map will keep references to older versions of the functions with stale state values
  useEffect(() => {
    if (map) {
      map.current.updateCallbacks(mapCallbacks);
    } 
  })

  // This catches if the URL is manually set
  useEffect(() =>  {
    if (prevPlaceType.current !== placeType || prevUsername.current !== username) {
      getPlacesAndInitMap();
      prevPlaceType.current = placeType;
      prevUsername.current = username;
    }
  }, [placeType, username]);

  // Catches if the user logs in or out
  useEffect(() => {
    if (firstRenderForVisitedPlaces.current) {
      firstRenderForVisitedPlaces.current = false;
    } else {
      getVisitedPlaces(null);
    }
  }, [isLoggedIn]);

  // These two catch when the URL changes to a different place or username, like if the user clicks to load a 
  // different type of place (which just changes the URL)
  useEffect(() => {
    if (props.match.params.placeType) {
      setPlaceType(props.match.params.placeType);
    }
  }, [props.match.params.placeType]);
  useEffect(() => {
    setUsername(props.match.params.username);
  }, [props.match.params.username]);

  const onMapPolygonMouseOver = (id) => {
    setMouseOverPlace(getPlaceFromId(id));
  }

  const onMapPolygonMouseOut = (id) => {
    setMouseOverPlace(null);
  }

  const onMapDataReloaded = () => {
    places.forEach(place => {
      if (place.visited) {
        map.current.toggleFeatureSelected(place.id, true);
      }
    });
  }

  const onMapPolygonClick = (id) => {
    if (isMyPlaces()) {
      map.current.toggleFeatureSelected(id);
      const newPlaces = [...places];
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
    return places.find(p => p.id === id);
  }

  const visitedPlaces = places.filter(p => p.visited);
  return (
    <Container>
      <Row>
        <Col>
          <h4 className='text-center'>
            {getYouveOrUserHas(username, true)} visited {visitedPlaces.length} out of {places.length}&nbsp;
            {getFullProperPlaceType(placeType, false)} - {printPercent(visitedPlaces.length, places.length)}
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
            places={places}
            placeType={placeType}
          />
        </Col>          
      </Row>
    </Container>
  );
};

export default Places;
