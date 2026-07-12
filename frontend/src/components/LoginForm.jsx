import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginForm = ({ onToggleView }) => {
  const { login, authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!email || !password) {
      setValidationError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      // Error is set in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form fade-in">
      <h1>Sign In.</h1>

      {(validationError || authError) && (
        <div style={{
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          color: '#f87171',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          {validationError || authError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address*"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (validationError) setValidationError('');
          }}
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Enter your password*"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (validationError) setValidationError('');
          }}
          disabled={loading}
          required
        />

        <div className="options">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" style={{ width: 'auto', marginBottom: 0 }} />
            Remember this device
          </label>
          <a href="/" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '25px', textAlign: 'center' }}>
        Don't have an account?{' '}
        <span 
          onClick={() => {
            clearError();
            onToggleView();
          }}
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
        >
          Create an account
        </span>
      </p>
    </div>
  );
};

export default LoginForm;