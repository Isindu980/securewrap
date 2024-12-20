import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import { FaUserEdit } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://securewrap-1621182990b0.herokuapp.com/api/user-dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError('Error fetching user data');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!newUsername) {
      toast.error('Username cannot be empty.');
      return;
    }

    try {
      const response = await axios.post('https://securewrap-1621182990b0.herokuapp.com/api/update-username', { username: newUsername }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUserData({ ...userData, username: newUsername });
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      <ToastContainer />
      <button onClick={toggleDarkMode}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <button onClick={handleLogout}>
        Logout
      </button>
      <div className="main-content">
        {error && <p className="error-message">{error}</p>}
        {userData ? (
          <div className="content">
            <div className="wrapper">
              <svg height="100" width="100%" viewBox="0 0 100 100">
                <text x="50%" y="50%" dy=".35em" textAnchor="middle" fontSize="24">
                  Welcome, {userData.username}
                </text>
              </svg>
            </div>
            <p>Email: {userData.email}</p>
            <form className="update-form" onSubmit={handleProfileUpdate}>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Update your username"
              />
              <button type="submit">
                <FaUserEdit /> Update Profile
              </button>
            </form>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
