import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import coordinateCommonsApp from './reducers';
import App from './components/App';
import './index.css';

let store = createStore(coordinateCommonsApp);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
