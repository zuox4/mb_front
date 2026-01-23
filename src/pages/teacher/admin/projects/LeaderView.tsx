import api from "@/services/api/api";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

// Типы для пропсов компонента
interface LeaderViewProps {
  id: number | string;
  size?: "sm" | "md" | "lg";
}

// Тип для данных пользователя
interface UserData {
  display_name?: string;
  image?: string;
  //   role?: string;
  //   position?: string;
  //   email?: string;
  //   phone?: string;
  //   department?: string;
  //   is_online?: boolean;
  // Можно добавить другие поля, которые возвращает API
}

// Тип для размеров
type SizeType = "sm" | "md" | "lg";

// Интерфейс для конфигурации размеров
interface SizeConfig {
  avatar: number;
  text: string;
}

const LeaderView: React.FC<LeaderViewProps> = ({ id, size = "md" }) => {
  const [data, setData] = useState<UserData>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Конфигурация размеров с явной типизацией
  const sizes: Record<SizeType, SizeConfig> = {
    sm: { avatar: 6, text: "text-xs" },
    md: { avatar: 8, text: "text-sm" },
    lg: { avatar: 10, text: "text-base" },
  };

  const currentSize: SizeConfig = sizes[size];

  const loadUser = (): void => {
    setLoading(true);
    api
      .get<UserData>(`/admin/get_teacher_info/${id}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error: Error) => {
        console.error("Error loading user data:", error);
        setData({});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-${currentSize.avatar} h-${currentSize.avatar} rounded-full bg-gray-700 animate-pulse`}
        ></div>
        <div className="h-3 w-20 bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Аватар */}
      <div className="relative flex-shrink-0">
        {data.image ? (
          <img
            src={data.image}
            alt={data.display_name || "Пользователь"}
            className={`w-${currentSize.avatar} h-${currentSize.avatar} rounded-full object-cover border border-sch-green-light/30`}
            onError={(e) => {
              // Если изображение не загружается, показываем заглушку
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div
            className={`w-${currentSize.avatar} h-${currentSize.avatar} rounded-full bg-gray-800 flex items-center justify-center border border-gray-700`}
          >
            <User className="w-3 h-3 text-gray-400" />
          </div>
        )}
      </div>

      {/* Имя */}
      <span
        className={`${currentSize.text} text-white truncate max-w-[150px]`}
        title={data.display_name} // Добавляем тултип с полным именем
      >
        {data.display_name || "Не указано"}
      </span>
    </div>
  );
};

export default LeaderView;
