import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { FaSpinner } from 'react-icons/fa';
import './styles/global.css';

const AppContent = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#080d1a',
        color: 'white',
        gap: '20px'
      }}>
        <FaSpinner 
          className="spinner" 
          style={{ 
            animation: 'spin 1s linear infinite', 
            fontSize: '40px', 
            color: '#6366f1' 
          }} 
        />
        <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#94a3b8' }}>
          Loading your workspace...
        </h3>
      </div>
    );
  }

  return user ? <DashboardPage /> : <AuthPage />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;