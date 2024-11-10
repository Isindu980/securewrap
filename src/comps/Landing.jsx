import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const newSparkle = { x: clientX, y: clientY, id: Date.now() };
      setSparkles((prevSparkles) => [...prevSparkles, newSparkle]);

      // Remove sparkles after animation completes
      setTimeout(() => {
        setSparkles((prevSparkles) =>
          prevSparkles.filter((sparkle) => sparkle.id !== newSparkle.id)
        );
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="landing-page">
      <motion.h1
        className="title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to Our Platform
      </motion.h1>
      <motion.p
        className="subtitle"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5 }}
      >
        The best place to manage your projects efficiently
      </motion.p>
      <div className="button-container">
        <motion.button
          className="btn login-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/login')}
        >
          Login
        </motion.button>
        <motion.button
          className="btn signup-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/signup')}
        >
          SignUp
        </motion.button>
      </div>
      <div className="sparkles-container">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="sparkle"
            style={{ left: sparkle.x, top: sparkle.y }}
            initial={{ opacity: 1.25 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </div>
    </div>
    
  );
};

export default LandingPage;
