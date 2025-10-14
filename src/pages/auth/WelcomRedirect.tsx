// components/auth/WelcomeRedirect.tsx
import { useAuthStore } from "@/stores/useAuthStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const WelcomeRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [animationStage, setAnimationStage] = useState(0);

  const [isExiting, setIsExiting] = useState(false);
  useEffect(() => {
    // Поэтапное появление элементов
    const stages = [100, 300, 500, 700, 900, 1100];
    stages.forEach((delay, index) => {
      setTimeout(() => setAnimationStage(index + 1), delay);
    });

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (user?.roles?.includes("teacher")) {
          navigate("/teacher");
        } else if (user?.roles?.includes("student")) {
          navigate("/student");
        } else {
          navigate("/");
        }
      }, 600);
    }, 4500);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  const getOpacityClass = (stage: number) => {
    return animationStage >= stage
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-4";
  };
  {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
          isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className=" rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          {/* Логотип */}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-700 ${getOpacityClass(1)}`}
          >
            <img src="/school1298.svg" alt="logoSchool" className="w-full" />
          </div>

          {/* Заголовок */}
          <h1
            className={`text-3xl font-bold text-white mb-4 font-codec-bold transition-all duration-700 ${getOpacityClass(2)}`}
          >
            Добро пожаловать!
          </h1>

          {/* Приветствие */}
          <p
            className={`text-lg mb-2 text-white transition-all duration-700 ${getOpacityClass(3)}`}
          >
            Здравствуйте,{" "}
            <span className="font-semibold text-indigo-300">
              {user?.display_name}
            </span>
            !
          </p>

          {/* Текст */}
          <p
            className={`text-gray-300 mb-6 transition-all duration-700 ${getOpacityClass(4)}`}
          >
            Рады видеть вас снова в системе
          </p>

          {/* Индикатор загрузки */}
          <div
            className={`flex justify-center items-center space-x-2 text-gray-300 transition-all duration-700 ${getOpacityClass(5)}`}
          >
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-300"></div>
            <span>Подготавливаем рабочее пространство...</span>
          </div>
          <DotLottieReact src="/qwe.json" loop autoplay />
          {/* Роль
          <div
            className={`mt-6 text-sm text-gray-300 transition-all duration-700 ${getOpacityClass(6)}`}
          >
            Роль: {user?.roles?.join(", ") || "Пользователь"}
          </div> */}
        </div>
      </div>
    );
  }

  return null;
};

export default WelcomeRedirect;
