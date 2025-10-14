// hooks/useAuth.ts
import { useAuthStore } from "@/stores/useAuthStore";

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,

    clearError,
  } = useAuthStore();

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,

    clearError,
  };
};
