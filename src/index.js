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
import Logout from './components/Logout';

render(
  <Router basename='/app'>
    <NavHeader />
    
    <Route path='/' exact component={Places} />
    <Route path='/places/:username/:placeType' component={Places} />
    <Route path='/mypage/:username' component={MyPage} />
    <Route path='/about' component={About} />
    <Route path='/signin' component={Signin} />
    <Route path='/logout' component={Logout} />
    <Route path='/signup' component={Signup} />
    <Route path='/verify' render={() => <Signup verify={true} />} />
  </Router>,
  document.getElementById('root')
);
