import { Group } from "@/hooks/admin/useAdminGroups";

import { Star } from "lucide-react";

import { useNavigate } from "react-router-dom";

const GroupCard = ({ group }: { group: Group }) => {
  // Безопасно получаем первый проектный офис
  // const firstProjectOffice = group.project_offices?.[0];
  // const hasLogo = firstProjectOffice?.logo_url;
  const navigate = useNavigate();

  return (
    <div key={group.id} className="group cursor-pointer">
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 h-full">
        {/* Заголовок класса */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {group.name.split("-")[0]}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{group.name}</h3>
              <p className="text-gray-400 text-sm">
                {(group.project_offices && group?.project_offices[0]?.title) ||
                  ""}
              </p>
            </div>
          </div>

          {/* Рейтинг */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < 4
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-700 text-gray-700"
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-1">4.0 рейтинг</div>
          </div>
        </div>

        {/* Информация о классе */}

        {/* Кнопка перехода */}
        <div
          className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center"
          onClick={() => navigate(`${group.id}`)}
        >
          <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Подробнее
          </span>
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
