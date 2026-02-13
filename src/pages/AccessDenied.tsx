// pages/AccessDenied.tsx
import { useLocation, useNavigate } from "react-router-dom";
import {
  Smartphone,
  Monitor,
  Tablet,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/auth";

const AccessDenied = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message, role, device, requiredDevice } = location.state || {};
  const { logout } = useAuth();
  const getDeviceIcon = () => {
    if (requiredDevice === "mobile") return Smartphone;
    if (requiredDevice === "tablet") return Tablet;
    return Monitor;
  };

  const DeviceIcon = getDeviceIcon();
  const isStudent = role === "student";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Доступ запрещен
        </h1>

        <p className="text-gray-600 mb-6">
          {message || "У вас нет доступа к этой странице"}
        </p>

        <div className="bg-blue-50 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3 text-left">
            <DeviceIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">
                {isStudent
                  ? "Используйте мобильное устройство"
                  : "Используйте компьютер"}
              </p>
              <p className="text-sm text-gray-600">
                {isStudent
                  ? "Ученики могут заходить только с телефона"
                  : "Администраторы и учителя могут заходить только с компьютера"}
              </p>
              {device && (
                <p className="text-xs text-gray-500 mt-1">
                  Текущее устройство:{" "}
                  {device === "mobile"
                    ? "Телефон"
                    : device === "tablet"
                      ? "Планшет"
                      : "Компьютер"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться назад
          </button>

          <button
            onClick={() => navigate(isStudent ? "/student" : "/teacher")}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Перейти на главную
          </button>
          <button
            className="underline cursor-pointer text-red-700"
            onClick={() => logout()}
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
