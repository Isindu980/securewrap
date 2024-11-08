import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './comps/signup';
import Login from './comps/login';
import Dashboard from './comps/Dashboard';
import LandingPage from './comps/Landing';






function App() {
    return (
        <Router>
            <Routes>    
              <Route path='/signup' element={<Signup/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/' element={<LandingPage/>} />
              <Route path='/dashboard' element={<Dashboard/>} />
               
            </Routes>
        </Router>
    );
}

export default App;