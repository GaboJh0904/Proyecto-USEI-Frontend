import axios from 'axios';

// Instancia pública de Axios (sin verificación de token)
const publicAxios = axios.create();

// Instancia protegida de Axios (con verificación de token)
const protectedAxios = axios.create();

// Agrega un interceptor de solicitud a `protectedAxios` para verificar el token
protectedAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      return Promise.reject(new Error('No autorizado. Se requiere token.'));
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export { publicAxios, protectedAxios };
