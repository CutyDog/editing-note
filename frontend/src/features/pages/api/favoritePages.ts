import axios from '../../../lib/axios';

export const favoritePage = async (pageId: number): Promise<void> => {
  await axios.post(`/api/pages/${pageId}/favorite`);
};

export const unfavoritePage = async (pageId: number): Promise<void> => {
  await axios.delete(`/api/pages/${pageId}/favorite`);
};
