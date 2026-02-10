import Loader from "@/components/owner/Loader";
import { useGroups } from "@/hooks/admin/useAdminGroups";

import { Star, Users, Trophy } from "lucide-react";
import GroupCard from "./GroupCard";

const GroupsList = () => {
  const { data: groupsData, isLoading } = useGroups();

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 font-codec">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {groupsData?.length || 0}
              </div>
              <div className="text-sm text-gray-300">Всего классов</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                4.2
                <span className="text-sm text-gray-400 ml-1">/5</span>
              </div>
              <div className="text-sm text-gray-300">Средний рейтинг</div>
            </div>
          </div>
        </div>
      </div>

      {/* Список классов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groupsData?.map((group) => (
          <GroupCard group={group} key={group.id} />
        ))}
      </div>

      {/* Пустое состояние */}
      {(!groupsData || groupsData.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="w-16 h-16 mx-auto opacity-50" />
          </div>
          <p className="text-gray-300 text-lg mb-2">Классы не найдены</p>
          <p className="text-gray-400">
            В системе пока нет зарегистрированных классов
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupsList;
