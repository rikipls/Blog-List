import axios from 'axios';

import { BlogData, NewBlogData } from '../types';

const baseUrl = '/api/blogs';
let token: string | null = null;

export const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};

export const getAll = async (): Promise<BlogData[]> => {
  const request = axios.get(baseUrl);
  return (await request).data;
};

export const create = async (newBlog: NewBlogData): Promise<BlogData> => {
  const config = { headers: { Authorization: token }};

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

export const replaceBlog = async (blogId: string, newBlog: NewBlogData, params: Record<string, any>): Promise<BlogData> => {
  const config = { headers: { Authorization: token }, params};
  const response = await axios.put(`${baseUrl}/${blogId}`, newBlog, config);
  return response.data;
};

export const deleteBlog = async (blogId: string) => {
  const config = { headers: { Authorization: token }};
  await axios.delete(`${baseUrl}/${blogId}`, config);
};
