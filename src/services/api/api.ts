import { useAuthStore } from "@/stores/useAuthStore"; // Импортируем ваш store
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
export const STATIC_BASE_URL =
  import.meta.env.VITE_STATIC_BASE_URL || "http://127.0.0.1:8000/static/logos/";
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || "10000";

export const privateApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(API_TIMEOUT),
});

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(API_TIMEOUT),
});

// Интерсептор с доступом к Zustand store
privateApi.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    const token = state.token; // Предполагаемая структура store

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на логин/обновление токена
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await useAuthStore.getState().refreshAuth();

        if (newToken) {
          // Обновляем токен в заголовке и повторяем запрос
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return privateApi(originalRequest);
        } else {
          // Если обновление токена не удалось, разлогиниваем
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default privateApi;
