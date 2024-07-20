import axios from 'axios';
import { UserData } from '../types';
const baseUrl = '/api/login';

export const login = async (credentials: { username: string, password: string}): Promise<UserData> => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};
