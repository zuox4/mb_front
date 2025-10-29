import { Group } from "@/hooks/admin/useAdminGroups";
import MoreButton from "../MoreButton";

const GroupCard = ({ group }: { group: Group }) => {
  // Безопасно получаем первый проектный офис
  // const firstProjectOffice = group.project_offices?.[0];
  // const hasLogo = firstProjectOffice?.logo_url;

  return (
    <div className="group relative w-40  bg-gradient-to-r from-sch-green-light/40 to-sch-green-light/20 hover:from-sch-green-light/50 hover:to-sch-green-light/30 hover:shadow-lg transition-all duration-300 rounded-xl p-4 border border-sch-green-light/30">
      <div className="flex justify-between items-center gap-3">
        {/* Логотип */}
        {/* <div className="flex-shrink-0">
          {hasLogo ? (
            <img
              className="w-30 object-contain rounded-lg"
              src={`${STATIC_BASE_URL}/${firstProjectOffice.logo_url}`}
              alt={`Логотип ${firstProjectOffice.title}`}
              onError={(e) => {
                // Fallback если изображение не загрузилось
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-16 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white/50 text-xs text-center">
                Нет лого
              </span>
            </div>
          )}
        </div> */}

        {/* Информация о группе */}
        {/* <div className="flex flex-col min-w-0"> */}
        <span className="text-xl font-codec-news text-white truncate">
          {group.name}
        </span>
        {/* <span className="text-white/80 font-codec-news text-sm truncate">
            {!firstProjectOffice?.title && (
              <span className="text-gray-400 italic">
                Проектный офис не назначен
              </span>
            )}
          </span> */}
        {/* </div> */}

        {/* Кнопка действий */}
        <MoreButton
          handleCardClick={() => console.log("Действие для группы:", group.id)}
        />
      </div>

      {/* Бэйджик если несколько проектным офисов
      {group.project_offices && group.project_offices.length > 1 && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          +{group.project_offices.length - 1}
        </div>
      )} */}
    </div>
  );
};

export default GroupCard;
