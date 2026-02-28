import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { Mail, Lock, LogIn } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div style={{
      maxWidth: '400px',
      width: '100%',
      padding: '2rem',
      background: 'var(--bg-card)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      border: '1px solid var(--border-color)',
      backdropFilter: 'blur(8px)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem', fontWeight: 700 }}>
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8b949e' }} />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8b949e' }} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          style={{
            padding: '12px',
            background: 'linear-gradient(135deg, #1f6feb, #58a6ff)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loginMutation.isPending ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'opacity 0.2s'
          }}
        >
          {loginMutation.isPending ? 'Logging in...' : (
            <>
              <LogIn size={18} />
              Login
            </>
          )}
        </button>
      </form>
    </div>
  );
};
