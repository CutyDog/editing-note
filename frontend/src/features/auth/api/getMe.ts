import axios from '../../../lib/axios';
import type { User } from '../../../types/auth';

export const getMe = async (): Promise<User> => {
  const { data } = await axios.get('/me');
  return data;
};
