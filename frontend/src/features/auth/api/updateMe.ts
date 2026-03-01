import axios from '../../../lib/axios';
import type { User } from '../../../types/auth';

export interface UpdateMeParams {
  user?: {
    email?: string;
    password?: string;
    password_confirmation?: string;
  };
  profile?: {
    name?: string;
  };
}

export const updateMe = async (params: UpdateMeParams): Promise<User> => {
  const { data } = await axios.patch('/me', params);
  return data;
};
