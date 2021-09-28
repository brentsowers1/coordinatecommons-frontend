import React from 'react';
import { render } from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavHeader from './components/NavHeader';
import MyPage from './components/MyPage';
import PlacesFunctional from './components/PlacesFunctional';
import About from './components/About';
import Signin from './components/Signin';
import SignupFunctional from './components/SignupFunctional';
import Logout from './components/Logout';

render(
  <Router basename='/app'>
    <NavHeader />
    
    <Route path='/' exact component={PlacesFunctional} />
    <Route path='/places/:username/:placeType' component={PlacesFunctional} />
    <Route path='/mypage/:username' component={MyPage} />
    <Route path='/about' component={About} />
    <Route path='/signin' component={Signin} />
    <Route path='/logout' component={Logout} />
    <Route path='/signup' component={SignupFunctional} />
    <Route path='/verify' render={() => <SignupFunctional verify={true} />} />
  </Router>,
  document.getElementById('root')
);
