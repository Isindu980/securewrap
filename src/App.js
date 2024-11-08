import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './comps/signup';
import Login from './comps/login';
import Dashboard from './comps/Dashboard';
import LandingPage from './comps/Landing';
import AdminDashboard from './comps/Admindashboard';






function App() {
    return (
        <Router>
            <Routes>    
              <Route path='/signup' element={<Signup/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/' element={<LandingPage/>} />
              <Route path='/dashboard' element={<Dashboard/>} />
              <Route path='/admin-dashboard' element={<AdminDashboard/>} />
               
            </Routes>
        </Router>
    );
}

export default App;