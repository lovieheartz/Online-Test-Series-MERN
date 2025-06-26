import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post('http://localhost:3001/login', formData);
      return response.data;
    },
    onSuccess: (data) => {
      const { token, role, name } = data;
      sessionStorage.setItem('authToken', token);
      login({ email: data.email, token, role, name });

      toast.success('Login successful!');

      setTimeout(() => {
        if (role === 'student') navigate('/student-dashboard');
        else if (role === 'faculty') navigate('/faculty-dashboard');
        else if (role === 'admin') navigate('/home');
      }, 1500);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome Back!</h2>
      {errors.email || errors.password ? (
        <p style={styles.error}>Email and password are required.</p>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email Address"
          {...register('email', { required: true })}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
        />
        <button 
          type="submit" 
          style={styles.submitButton} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={styles.forgotPasswordText}>
        <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
      </p>

      <p style={styles.switchText}>
        Don't have an account?{' '}
        <Link to="/" style={styles.link}>Register here</Link>
      </p>

      <ToastContainer autoClose={2000} />
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