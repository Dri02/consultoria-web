// src/services/api.js
import axios from 'axios';

// Crea una instancia de Axios con la URL base de tu backend
const api = axios.create({
  baseURL: 'http://localhost:3004', // Cambia a tu dominio seguro
});

// Interceptor para añadir el token a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
