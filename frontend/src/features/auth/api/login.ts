import client from '../../../lib/axios';
import type { AuthResponse } from '../../../types/auth';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/api/auth/login', {
    email,
    password,
  });
  return response.data;
};
