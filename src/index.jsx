import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavHeader from './components/NavHeader';
import MyPage from './components/MyPage';
import Places from './components/Places';
import About from './components/About';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Logout from './components/Logout';


const root = createRoot(document.getElementById('root'));
root.render(
  <Router basename='/app'>
    <NavHeader />
    <Routes>
      <Route path='/' element={<Places />} />
      <Route path='/places/:username/:placeType' element={<Places />} />
      <Route path='/mypage/:username' element={<MyPage />} />
      <Route path='/about' element={<About />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/logout' element={<Logout />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/verify' element={<Signup verify={true} />} />
    </Routes>
  </Router>
);
