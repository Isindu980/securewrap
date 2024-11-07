import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import './Login.css';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const navigate = useNavigate(); // Initialize navigate from useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      setSuccessMessage(response.data.message);
      setIsOtpSent(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : 'Server error during login.');
      setSuccessMessage('');
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();

    if (!otp) {
      setErrorMessage('OTP is required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', { email, otp });
      setToken(response.data.token); // Update token in state
      setIsOtpVerified(true);
      setSuccessMessage('OTP verified successfully.');
      setErrorMessage('');
    
      // Store token in localStorage for persistence
      localStorage.setItem('token', response.data.token);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : 'Server error during OTP verification.');
      setSuccessMessage('');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState); // Toggle password visibility
  };

  return (
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
                type={passwordVisible ? 'text' : 'password'} // Toggle password visibility
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}  {/* Display eye or eye-slash icon */}
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

      {/* Link to signup page if not registered */}
      <div className="signup-link">
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;
