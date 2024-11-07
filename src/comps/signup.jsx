import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ('./signup.css');

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Hook to handle navigation

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        username,
        email,
        password
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');  // Navigate to login page after success
      }, 2000);  // Wait for 2 seconds before redirecting
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Already have an account? <a href="/login" className="login-link">Login here</a>
      </p>
    </div>
  );
};

export default Signup;
