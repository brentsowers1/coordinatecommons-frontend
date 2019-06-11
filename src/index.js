import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import coordinateCommonsApp from './reducers';
import ActivePlaces from './containers/ActivePlaces';
import './index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavHeader from './components/NavHeader';
import MyPage from './components/MyPage';

let store = createStore(coordinateCommonsApp);

render(
  <Provider store={store}>
    <Router>
      <NavHeader />
      
      <Route path="/" exact component={ActivePlaces} />
      <Route path="/places/:placeType" component={ActivePlaces} />
      <Route path="/mypage" component={MyPage} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
