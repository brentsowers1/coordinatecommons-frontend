import React from 'react';
import { render } from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavHeader from './components/NavHeader';
import MyPage from './components/MyPage';
import Places from './components/Places';
import About from './components/About';
import Signin from './components/Signin';
import Signup from './components/Signup';

render(
  <Router basename='/app'>
    <NavHeader />
    
    <Route path='/' exact component={Places} />
    <Route path='/places/:placeType' component={Places} />
    <Route path='/mypage' component={MyPage} />
    <Route path='/about' component={About} />
    <Route path='/signin' component={Signin} />
    <Route path='/signup' component={Signup} /> 
  </Router>,
  document.getElementById('root')
);
