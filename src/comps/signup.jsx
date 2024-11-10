import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import './signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();

  const siteKey = '6LelVnoqAAAAAFW4C2HZXoCrUMMZjxXWRwxSUEl8';

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleCaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });

    let valid = true;

    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
      valid = false;
    }

    if (!validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character.',
      }));
      valid = false;
    }

    if (!recaptchaToken) {
      setMessage('Please complete the CAPTCHA');
      return;
    }

    if (!valid) return;

    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        username,
        email,
        password,
        recaptchaToken,
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>

        <ReCAPTCHA
          sitekey={siteKey}
          onChange={handleCaptchaChange}
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
