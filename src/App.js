import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './comps/signup';
import Login from './comps/login';
import Dashboard from './comps/Dashboard';






function App() {
    return (
        <Router>
            <Routes>    
              <Route path='/signup' element={<Signup/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/' element={<Login/>} />
              <Route path='/dashboard' element={<Dashboard/>} />
               
            </Routes>
        </Router>
    );
}

export default App;