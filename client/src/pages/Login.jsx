import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/login', { email, password });

      if (res.data && res.data.token) {
        const { token, role, name } = res.data;
        sessionStorage.setItem('authToken', token);
        login({ email, token, role, name });

        toast.success('Login successful!');

        setTimeout(() => {
          if (role === 'student') {
            navigate('/student-dashboard');
          } else if (role === 'faculty') {
            navigate('/faculty-dashboard');
          } else if (role === 'admin') {
            navigate('/home');
          } else {
            setError('Unknown role. Cannot redirect.');
          }
        }, 1500); // wait briefly so user sees the toast
      } else {
        setError(res.data.message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome Back!</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit" style={styles.submitButton}>
          Login
        </button>
      </form>

      <p style={styles.forgotPasswordText}>
        <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
      </p>

      <p style={styles.switchText}>
        Don’t have an account?{' '}
        <Link to="/" style={styles.link}>Register here</Link>
      </p>

      {/* Toast Container for notifications */}
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Bootstrap Modal (unchanged) */}
      <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog model-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">Authentication Required</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Login is required to access that page.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: '#f7f9fc',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  submitButton: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4a90e2',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  forgotPasswordText: {
    textAlign: 'center',
    margin: '10px 0',
    color: '#555',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '10px',
    color: '#555',
  },
  link: {
    color: '#4a90e2',
    textDecoration: 'underline',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Login;
