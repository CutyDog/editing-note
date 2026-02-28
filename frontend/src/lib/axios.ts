import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター: アクセストークンを付与
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスインターセプター: 401エラー（トークン切れ）時のリフレッシュ処理
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post(`${baseURL}/api/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          // 新しいトークンで再試行
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return client(originalRequest);
        } catch {
          // リフレッシュ失敗時はログアウト
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
