import React from 'react';
import { LoginForm } from '../../features/auth';

const LoginPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-main)',
      padding: '1rem'
    }}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
