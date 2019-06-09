import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import coordinateCommonsApp from './reducers';
import MyPlaces from './components/MyPlaces';
import './index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavHeader from './components/NavHeader';

let store = createStore(coordinateCommonsApp);

render(
  <Provider store={store}>
    <Router>
      <NavHeader />
      
      <Route path="/" exact component={MyPlaces} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
