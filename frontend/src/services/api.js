import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("course-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function errorMessage(error) {
  return error.response?.data?.message || "We could not complete your request. Please try again.";
}

export default api;
