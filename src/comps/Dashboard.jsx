import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newProfilePic, setNewProfilePic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }
      

      try {
        const response = await axios.get('http://localhost:5000/api/user-dashboard', {
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
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!newUsername) {
      setError('Username cannot be empty.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/update-username', { username: newUsername }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.success) {
        setUserData({ ...userData, username: newUsername }); // Update the state with the new username
        alert('Profile updated successfully!');
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      setError('Error updating profile');
    }
  };
  

  return (
    <div>
      
      {error && <p>{error}</p>}

      {userData ? (
        <div>
          <h1>Welcome</h1>
          <h2>{userData.username}</h2>
          <p>Email: {userData.email}</p>
          {userData.profilePic && <img src={userData.profilePic} alt="Profile" />}
          
          <form onSubmit={handleProfileUpdate}>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Update your name"
            />
            
            <button type="submit">Update Profile</button>
          </form>

          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
