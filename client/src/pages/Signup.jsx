import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, phone } = formData;

    if (!email || !password || (!isLogin && (!name || !confirmPassword || !phone))) {
      toast.error('All fields are required.');
      return;
    }

    if (!isLogin && !/^\+\d{10,15}$/.test(phone)) {
      toast.error('Please enter a valid phone number with country code.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (isLogin) {
      axios
        .post('http://localhost:3001/login', { email, password })
        .then((result) => {
          const { token, role } = result.data;
          localStorage.setItem('jwtToken', token);
          localStorage.setItem('userRole', role);
          toast.success('Login successful!');

          setTimeout(() => {
            if (role === 'admin') navigate('/home');
            else if (role === 'faculty') navigate('/faculty-dashboard');
            else if (role === 'student') navigate('/student-dashboard');
            else navigate('/');
          }, 1500);
        })
        .catch((err) => {
          console.error('Login error:', err);
          toast.error('Login failed. Check your credentials.');
        });
    } else {
      axios
        .post('http://localhost:3001/student', { name, email, password, phone })
        .then((result) => {
          console.log('Registered:', result.data);
          toast.success('Registration successful!');
          setTimeout(() => navigate('/login'), 1500);
        })
        .catch((err) => {
          console.error('Registration error:', err);
          toast.error('Registration failed. Try again.');
        });
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <div style={styles.toggleContainer}>
        <button
          onClick={() => {
            setIsLogin(false);
            navigate('/');
          }}
          style={{
            ...styles.toggleButton,
            backgroundColor: !isLogin ? '#4a90e2' : '#ccc',
            color: !isLogin ? '#fff' : '#333',
          }}
        >
          Register
        </button>
        <button
          onClick={() => {
            setIsLogin(true);
            navigate('/login');
          }}
          style={{
            ...styles.toggleButton,
            backgroundColor: isLogin ? '#4a90e2' : '#ccc',
            color: isLogin ? '#fff' : '#333',
          }}
        >
          Login
        </button>
      </div>

      <h2 style={styles.heading}>{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {!isLogin && (
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
        )}
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        {!isLogin && (
          <input
            style={styles.input}
            type="tel"
            name="phone"
            placeholder="Phone Number (e.g., +91XXXXXXXXXX)"
            value={formData.phone}
            onChange={handleChange}
          />
        )}
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {!isLogin && (
          <input
            style={styles.input}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        )}
        <button type="submit" style={styles.submitButton}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <p style={styles.switchText}>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Register here' : 'Login here'}
        </span>
      </p>
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
  toggleContainer: {
    display: 'flex',
    marginBottom: '20px',
    gap: '10px',
    justifyContent: 'center',
  },
  toggleButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#555',
  },
  link: {
    color: '#4a90e2',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
};

export default Signup;
