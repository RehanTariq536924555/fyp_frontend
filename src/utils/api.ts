import axios from 'axios';

const API_URL = 'http://localhost:3001/auth'; // Backend base URL

export const registerUser = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (data: { token: string; password: string }) => {
  const response = await axios.post(`${API_URL}/reset-password`, data);
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await axios.get(`${API_URL}/verify-email/${token}`);
  return response.data;
};