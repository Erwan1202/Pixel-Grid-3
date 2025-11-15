import apiClient from './api.js';

const login = async (email, password) => {
  const response = await apiClient.post('/api/auth/login', {
    email,
    password,
  });
  
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }
  return response.data;
};

const register = async (username, email, password) => {
  const response = await apiClient.post('/api/auth/register', {
    username,
    email,
    password,
  });
  
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const authService = {
  login,
  register,
  logout,
};

export default authService;