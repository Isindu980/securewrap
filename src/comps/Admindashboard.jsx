import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admindashboard.css';
import { FaUsers, FaSignOutAlt, FaTasks, FaUser } from 'react-icons/fa';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);  // Logs state to store the logs
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const adminResponse = await axios.get('http://localhost:5000/api/admin-dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersResponse = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const logsResponse = await axios.get('http://localhost:5000/api/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (adminResponse.data.success && usersResponse.data.success) {
          setAdminData(adminResponse.data.admin);
          setUsers(usersResponse.data.users);
          setLogs(logsResponse.data.logs || []);  // Set the logs here, ensure it's an array
        } else {
          setError('Failed to fetch data.');
          handleLogout();
        }
      } catch (err) {
        setError('Error fetching data.');
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteUser = async (userId, userEmail) => {
    const token = localStorage.getItem('token'); // or wherever you store your token
  
    if (!token) {
      console.error('No authorization token found');
      return;
    }
  
    // Check if the user is the admin
    if (userEmail === 'isindu980@gmail.com') {
      alert('Admin user cannot be deleted!');
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Send the token in the Authorization header
        },
      });
  
      console.log(response.data); // Handle the successful deletion response
      alert(`User with ID ${userId} deleted successfully!`); // Popup alert
  
      // Optionally, you can re-fetch the user list after deletion
      setUsers(users.filter(user => user._id !== userId));
  
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.'); // Popup alert on error
    }
  };
  
  
  
  

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><FaUsers /> User Management</li>
          <li><FaTasks /> Logs</li>
          <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <h2>Welcome, {adminData?.username}</h2>
          
        </div>

        <div className="content-section">
          {error && <p className="error-message">{error}</p>}

          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              <div className="user-management">
                <h3><FaUsers /> All Users</h3>
                <ul className="user-list">
                  {users.map((user) => (
                    <li key={user._id}>
                      <FaUser /> {user.username} ({user.email})
                      <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="logs">
                <h3><FaTasks /> Log Activity</h3>
                {logs.length === 0 ? (
                  <p>No logs available</p>
                ) : (
                  <ul>
                    {logs.map((log) => (
                      <li key={log._id}>{log.message}</li>  // Displaying the logs here
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
