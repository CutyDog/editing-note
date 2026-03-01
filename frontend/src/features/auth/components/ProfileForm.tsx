import React, { useState } from 'react';
import { useUpdateMe } from '../hooks';
import { Loader2 } from 'lucide-react';
import type { User } from '../../../types/auth';

export const ProfileForm: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
  const { mutate: updateMe, isPending: isUpdating } = useUpdateMe();
  const [name, setName] = useState(user.profile?.name || '');
  const [email, setEmail] = useState(user.email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMe(
      {
        user: { email },
        profile: { name },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error(error);
          alert('Failed to update profile');
        }
      }
    );
  };

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Display Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-primary)',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-primary)',
            fontSize: '1rem'
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isUpdating}
        style={{
          marginTop: '1rem',
          padding: '10px',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          color: 'var(--bg-main)',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {isUpdating ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
      </button>
    </form>
  );
};
