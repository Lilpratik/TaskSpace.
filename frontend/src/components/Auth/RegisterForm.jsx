import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = ({ onToggleView }) => {
  const { register, authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!email || !password || !confirmPassword) {
      setValidationError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
    } catch (err) {
      // Error is already set in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form fade-in">
      <h1>Sign Up.</h1>

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
          placeholder="Choose password (min 6 chars)*"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (validationError) setValidationError('');
          }}
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Confirm password*"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (validationError) setValidationError('');
          }}
          disabled={loading}
          required
        />

        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '10px' }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '25px', textAlign: 'center' }}>
        Already have an account?{' '}
        <span 
          onClick={() => {
            clearError();
            onToggleView();
          }}
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
        >
          Sign In
        </span>
      </p>
    </div>
  );
};

export default RegisterForm;
