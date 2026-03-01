import React from 'react';
import { useMe } from '../hooks';
import { Loader2, X } from 'lucide-react';
import { ProfileForm } from './ProfileForm';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { data: user, isLoading } = useMe();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>
      <div className="card" style={{ width: '400px', maxWidth: '90vw', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '4px', background: 'transparent', border: 'none', boxShadow: 'none' }}
        >
          <X size={20} color="var(--text-secondary)" />
        </button>

        <h2 style={{ fontSize: '1.5rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Profile Settings</h2>

        {isLoading || !user ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader2 size={32} className="animate-spin" color="var(--accent-primary)" />
          </div>
        ) : (
          <ProfileForm user={user} onClose={onClose} />
        )}
      </div>
    </div>
  );
};
