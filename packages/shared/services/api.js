import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const TOKEN_KEY = 'temple-token';

// NOTE: we intentionally do NOT set a default `Content-Type`. axios sets
// `application/json` automatically for plain-object bodies, and lets the browser
// set `multipart/form-data` (with the required boundary) for FormData uploads.
// Forcing a default JSON content-type breaks file uploads.
const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Safety: never let a JSON content-type ride along with a FormData upload.
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (config.headers?.delete) config.headers.delete('Content-Type');
    else if (config.headers) delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // future: redirect to login
    }
    return Promise.reject(err);
  },
);

export default api;
