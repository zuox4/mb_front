// stores/useAuthStore.ts
import privateApi, { publicApi } from "@/services/api/api";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  email: string;
  display_name: string;
  roles?: string[];
  external_id: string;
  is_verified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  refreshAuth: () => Promise<string | null>;
  logout: () => void;
  clearError: () => void;
  isVerifying: boolean;
  verifyError: string | null;
  verifyEmail: (token: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isVerifying: false,
      verifyError: null,

      verifyEmail: async (token: string) => {
        set({ isVerifying: true, verifyError: null });
        try {
          const response = await privateApi.post("/auth/verify-email", {
            token,
          });
          console.log(response.data);
          set({
            isVerifying: false,
            verifyError: null,
            user: response.data.user,
            token: response.data.access_token,
            refreshToken: response.data.refresh_token,
            isAuthenticated: true,
          });
          toast.success("Email verified successfully!");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Verification failed";
          set({
            isVerifying: false,
            verifyError: errorMessage,
          });
          toast.error(errorMessage);
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await privateApi.post("/auth/login", {
            email,
            password,
          });
          const {
            user,
            access_token: token,
            refresh_token: refreshToken,
          } = response.data;

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success("Успешная авторизация");

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || "Login failed";
          toast.error(errorMessage);
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      loginWithGoogle: async (googleToken: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await publicApi.post("/auth/google", {
            token: googleToken,
          });
          const {
            user,
            access_token: token,
            refresh_token: refreshToken,
          } = response.data;

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success("Успешная авторизация через Google");

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.detail || "Google authentication failed";
          toast.error(errorMessage);
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await privateApi.post("/auth/register", {
            email,
            password,
          });
          toast.success(response.data.message || "Registration successful");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.detail || "Registration failed";
          toast.error(errorMessage);
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      refreshAuth: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        try {
          const response = await privateApi.post("/auth/refresh", {
            refresh_token: refreshToken,
          });

          const {
            user,
            access_token: token,
            refresh_token: newRefreshToken,
          } = response.data;

          set({
            user,
            token,
            refreshToken: newRefreshToken || refreshToken,
            isAuthenticated: true,
          });

          return token;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.detail || "Token refresh failed";
          console.error(errorMessage);
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });

          toast.error("Session expired. Please login again.");
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
          state.isAuthenticated = !!state.token;
        }
      },
      version: 1,
    }
  )
);
