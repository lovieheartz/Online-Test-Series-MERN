import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3001/reset-password', {
        token,
        password,
        type,
      });

      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    }
  };

  useEffect(() => {
    if (!token || !type) {
      setError('Invalid or missing reset link parameters.');
    }
  }, [token, type]);

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Reset Your Password</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
      {!message && (
        <form onSubmit={handleSubmit}>
          <input
  type="password"
  placeholder="Enter new password"
  autoComplete="new-password" // ✅ Add this
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
/>

          <button type="submit" style={{ padding: '10px', width: '100%' }}>
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
