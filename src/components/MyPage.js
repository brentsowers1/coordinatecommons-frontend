import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import LoggedInUser from '../classes/LoggedInUser';
import SignInOrUpPrompt from './SignInOrUpPrompt';
import ApiClient from '../classes/ApiClient';
import { getFullProperPlaceType } from '../util/name-utils';
import { Link } from 'react-router-dom';

const MyPage = (props) => {
  const [isFetchingPlaces, setIsFetchingPlaces] = useState(false);
  const [places, setPlaces] = useState(null);

  const username = props.match.params.username ? props.match.params.username : 'my';
  const isMy = username === 'my';

  const allPlaceTypes = ['us-state', 'canada-state', 'country'];

  if (isMy && !LoggedInUser.isLoggedIn) {
    return (<Container><SignInOrUpPrompt /></Container>);
  }

  if (!isFetchingPlaces && places === null) {
    // TODO: Add support for other users
    ApiClient.getVisitedPlaces(null, null, (response) => {
      setIsFetchingPlaces(false);
      if (response.places !== undefined) {
        setPlaces(response.places);  
      } else {
        setPlaces([]);
      }
    });
    setIsFetchingPlaces(true);
  }

  return (
    <Container>
      {isFetchingPlaces ? 
        <React.Fragment>
          Fetching places visited...
        </React.Fragment>
      :
        places ?
          <table>
            <thead>
              <tr>
                <th>Place Type</th>
                <th>Places Visited</th>
                {isMy && LoggedInUser.isLoggedIn ? 
                  <React.Fragment>
                    <th>Edit Link</th><th>Share Link</th>                  
                  </React.Fragment> 
                : <th>View</th>}
              </tr>
            </thead>
            <tbody>
              {allPlaceTypes.map(pt => {
                const thesePlaces = places.find(p => p.PlaceType === pt);
                const visitedCount = thesePlaces && thesePlaces.PlacesVisited ? thesePlaces.PlacesVisited.length : 0;
                const viewLink = '/places/' + username + '/' + pt;
                const shareLink = LoggedInUser.isLoggedIn ? '/places/' + LoggedInUser.username + '/' + pt : null;
                return (
                  <tr>
                    <td>
                      {getFullProperPlaceType(pt, true)}
                    </td>
                    <td>
                      {visitedCount}
                    </td>
                    <td>
                      {isMy || visitedCount ? <Link to={viewLink}>{ 'https://' + window.location.hostname + viewLink}</Link> : ''}
                    </td>
                    {isMy && LoggedInUser.isLoggedIn ?
                      <td>
                        <Link to={shareLink}>{'https://' + window.location.hostname + shareLink}</Link>
                      </td>
                    : 
                      ''}
                  </tr>
                );
              })}
            </tbody>
          </table>
        :
          ''
      }
    </Container>
  );

};

export default MyPage;
