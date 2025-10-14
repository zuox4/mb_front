// components/CorrectGoogleButton.tsx
import { useAuthStore } from "@/stores/useAuthStore";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const CorrectGoogleButton: React.FC = () => {
  const { loginWithGoogle } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("🔐 Google OAuth response:", tokenResponse);
      setLoading(true);

      try {
        // Важно: используем id_token, а не access_token

        // Если у нас есть access_token, но нет id_token, получаем user info
        if (tokenResponse.access_token) {
          console.log("🔄 Getting user info with access token...");
          const userInfo = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            }
          );

          if (userInfo.ok) {
            const userData = await userInfo.json();
            console.log("👤 User info:", userData);

            // Отправляем access_token на бэкенд, но бэкенд должен его правильно обработать
            await loginWithGoogle(tokenResponse.access_token);
            navigate("/welcome");
          } else {
            throw new Error("Failed to get user info");
          }
        } else {
          throw new Error("No valid token received");
        }
      } catch (error) {
        console.error("❌ Google auth error:", error);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("❌ Google OAuth error:", error);
      setLoading(false);
    },
    // Ключевые настройки для получения правильных токенов
    flow: "implicit",
    scope: "email profile openid",
    // Явно запрашиваем id_token
  });

  return (
    <Button
      onClick={() => login()}
      disabled={loading}
      className="w-full bg-sch-blue-ultra cursor-pointer h-10 text-md"
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Войти через Google
        </>
      )}
    </Button>
  );
};

export default CorrectGoogleButton;
