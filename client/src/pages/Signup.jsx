import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = React.useState(false); // keep this one only for toggling views

  // React Query Mutations
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
      return res.json();
    },
    onSuccess: ({ token, role }) => {
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userRole', role);
      toast.success('Login successful!');
      setTimeout(() => {
        if (role === 'admin') navigate('/home');
        else if (role === 'faculty') navigate('/faculty-dashboard');
        else if (role === 'student') navigate('/student-dashboard');
        else navigate('/');
      }, 1500);
    },
    onError: (err) => toast.error(err.message),
  });

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, phone, password }) => {
      const res = await fetch('http://localhost:3001/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Registration successful!');
      setTimeout(() => navigate('/login'), 1500);
    },
    onError: (err) => toast.error(err.message),
  });

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!email || !password || (!isLogin && (!name || !phone || !confirmPassword))) {
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
      loginMutation.mutate({ email, password });
    } else {
      registerMutation.mutate({ name, email, phone, password });
    }

    form.reset();
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
            required
          />
        )}
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email Address"
          required
        />
        {!isLogin && (
          <input
            style={styles.input}
            type="tel"
            name="phone"
            placeholder="Phone Number (e.g., +91XXXXXXXXXX)"
            required
          />
        )}
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        {!isLogin && (
          <input
            style={styles.input}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
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
