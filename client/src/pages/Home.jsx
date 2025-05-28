import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; // ✅ Import new Header
import Card from '../components/Card';
import Footer from '../components/Footer';
import './Dashboard.css';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logout();
    navigate('/login',{replace:true});
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>You are not logged in</h1>
        <p style={styles.subheading}>Please login to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        {/* ✅ Use Header component */}
        <Header
          user={user}
          toggleDropdown={toggleDropdown}
          isDropdownOpen={isDropdownOpen}
          handleLogout={handleLogout}
          navigate={navigate}
        />

        <div className="card-container">
          <Card title="Student Dashboard" />
          <Card title="Faculty Dashboard" />
          <Card title="Admin Dashboard" />
        </div>

        <Footer />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f8',
    padding: '20px',
  },
  heading: {
    fontSize: '32px',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px',
    textAlign: 'center',
  },
};

export default Home;
