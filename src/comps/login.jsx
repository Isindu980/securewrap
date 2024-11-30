import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Handle login request
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    try {
      const response = await axios.post('https://secure-wrap-56515c48269a.herokuapp.com/api/login', { email, password });
      setSuccessMessage(response.data.message);
      setIsOtpSent(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : 'Server error during login.');
      setSuccessMessage('');
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async (e) => {
    e.preventDefault();
  
    if (!otp) {
      setErrorMessage('OTP is required.');
      return;
    }
  
    try {
      const response = await axios.post('https://secure-wrap-56515c48269a.herokuapp.com/api/verify-otp', { email, otp });
      const { token, role, isAdmin, userData, navigateTo } = response.data;
      setToken(token);
      setIsOtpVerified(true);
      setSuccessMessage('OTP verified successfully.');
      setErrorMessage('');
  
      // Store the token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userData', JSON.stringify(userData));
  
      // Check for the specific email 'isindu980@gmail.com'
      if (email === 'isindu980@gmail.com') {
        navigate('/admin-dashboard');
      } else if (navigateTo === 'admin-dashboard') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : 'Server error during OTP verification.');
      setSuccessMessage('');
    }
  };
  
  
  
  
  

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState);
  };

  // Forgot password function


 

  return (
    <div className="page-container">
      <button
        className="back-to-landing-btn"
        onClick={() => navigate('/')}
      >
        Back to Landing Page
      </button>

      <div className="login-container">
        <h2>Login</h2>
        {!isOtpSent && !isOtpVerified && (
          <form onSubmit={handleLogin}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <div className="password-input-container">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit">Login</button>
          </form>
        )}

        {isOtpSent && !isOtpVerified && (
          <form onSubmit={handleOtpVerification}>
            <div>
              <label>OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit">Verify OTP</button>
          </form>
        )}

        {isOtpVerified && (
          <div>
            <h3>OTP Verified</h3>
            <p>Redirecting to your dashboard...</p>
          </div>
        )}

        {errorMessage && <div className="error">{errorMessage}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <div className="signup-link">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
