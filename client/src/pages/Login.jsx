import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // useEffect(() => 
  // {
  //   localStorage.removeItem('authToken');

  //   const modalEl = document.getElementById('loginModal');

  //   if (location.state?.fromProtected && window.bootstrap?.Modal) 
  //   {
  //     const modal = new window.bootstrap.Modal(modalEl);
  //     modal.show();
  //     window.history.replaceState({}, document.title);
  //   }
  // }, [location]);

  // useEffect(() => {
  //   if (showModal) {
  //     const timer = setTimeout(() => {
  //       setShowModal(false);
  //       navigate('/login', { replace: true });
  //     }, 1000); // 3000ms = 3 seconds

  //     return () => clearTimeout(timer); // cleanup if modal hides early
  //   }
  // }, [showModal, navigate]);

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

        alert('Login successful!');

        if (role === 'student') {
          navigate('/student-dashboard');
        } else if (role === 'faculty') {
          navigate('/faculty-dashboard');
        } else if (role === 'admin') {
          navigate('/home');
        } else {
          setError('Unknown role. Cannot redirect.');
        }
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

      <p style={styles.switchText}>
        Don’t have an account?{' '}
        <Link to="/register" style={styles.link}>Register here</Link>
      </p>

      {/* Bootstrap Modal */}
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
  switchText: {
    textAlign: 'center',
    marginTop: '20px',
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
