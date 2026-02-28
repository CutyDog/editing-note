import { useMutation } from '@tanstack/react-query';
import { login } from '../api';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token);
      navigate('/');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.error('Login failed:', error);
      alert(error.response?.data?.error || 'ログインに失敗しました');
    },
  });
};
