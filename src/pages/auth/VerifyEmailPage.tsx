// pages/VerifyEmailPage.tsx
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, isVerifying, verifyError } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        await verifyEmail(token);
        setStatus("success");

        // Перенаправляем через несколько секунд
        setTimeout(() => {
          navigate("/welcome");
        }, 3000);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setStatus("error");
      }
    };

    verify();
  }, [token, verifyEmail, navigate]);

  if (status === "loading" || isVerifying) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12  mx-auto"></div>
          <p className="mt-4 text-white">Подтверждаем ваш Email...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Почта подтверждена!
          </h1>
          <p className="text-gray-600">
            Адрес электронной почты был успешно подтвержден!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verification Failed
        </h1>
        <p className="text-gray-600 mb-4">
          {verifyError || "Invalid or expired verification token"}
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};
export default VerifyEmailPage;
