import React from 'react';
import { render } from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavHeader from './components/NavHeader';
import MyPage from './components/MyPage';
import Places from './components/Places';

render(
  <Router basename='/app'>
    <NavHeader />
    
    <Route path="/" exact component={Places} />
    <Route path="/places/:placeType" component={Places} />
    <Route path="/mypage" component={MyPage} />
  </Router>,
  document.getElementById('root')
);
