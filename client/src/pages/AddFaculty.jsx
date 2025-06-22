import React, { useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Dashboard.css';

const AddFaculty = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
  });

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ useMutation for form submission
  const { mutate, isPending } = useMutation({
    mutationFn: async (newFaculty) => {
      const res = await axios.post(
        'http://localhost:3001/faculty/create-faculty',
        newFaculty
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Faculty created successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization: '',
      });
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || 'Failed to create faculty';
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, phone, password, specialization } = formData;

    if (!name || !email || !phone || !password || !specialization) {
      toast.error('All fields are required!');
      return;
    }

    // ✅ trigger mutation
    mutate({ name, email, phone, password, specialization });
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
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
        <Header
          user={user}
          toggleDropdown={toggleDropdown}
          isDropdownOpen={isDropdownOpen}
          handleLogout={handleLogout}
          navigate={navigate}
        />

        <div className="form-container">
          <div className="form-wrapper">
            <h2 className="form-heading">Create Faculty</h2>

            <form onSubmit={handleSubmit} className="faculty-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Faculty Name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Faculty Email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Faculty Password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Faculty Phone (+1234567890)"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => navigate('/admin/faculty')}
                  className="text-blue-600 hover:text-blue-800 px-4 py-2"
                  type="button"
                >
                  ← Back to Faculty List
                </button>
                <button type="submit" className="submit-button" disabled={isPending}>
                  {isPending ? 'Creating...' : 'Create Faculty'}
                </button>
              </div>
            </form>
          </div>
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

export default AddFaculty;
