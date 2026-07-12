import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import SocialLogin from '../components/SocialLogin';
import '../styles/login.css';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="left">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setIsLoginView(true)}>
            <div className="circle" style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
            }}></div>
            <h2>TaskSpace.</h2>
          </div>

          {isLoginView ? (
            <LoginForm onToggleView={() => setIsLoginView(false)} />
          ) : (
            <RegisterForm onToggleView={() => setIsLoginView(true)} />
          )}
        </div>

        <div className="divider"></div>

        <div className="right">
          <SocialLogin />
        </div>
      </div>

      <div className="gradient-circle"></div>
    </div>
  );
};

export default AuthPage;
