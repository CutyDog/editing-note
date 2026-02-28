import axios from '../../../lib/axios';

export const deletePage = async (id: number): Promise<void> => {
  await axios.delete(`/api/pages/${id}`);
};
