import api from "@/services/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Edit,
  X,
  Check,
  Users,
  UserPlus,
  UserMinus,
  Loader2,
  Award,
} from "lucide-react";

interface Leader {
  id: number;
  display_name: string;
  email: string;
  roles: string[];
  image: string;
}

interface Teacher {
  id: number;
  email: string;
  display_name: string;
  roles: string[];
  image: string;
}

interface BossProps {
  eventTypeId: number;
  onLeaderChange?: (newLeader: Leader | null) => void;
}

const Boss = ({ eventTypeId, onLeaderChange }: BossProps) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [leader, setLeader] = useState<Leader | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await api.get("/admin/get_teachers_info");
        setTeachers(response.data);
      } catch (error) {
        console.error("Ошибка загрузки учителей:", error);
      }
    };
    loadTeachers();
  }, []);

  useEffect(() => {
    const loadLeader = async () => {
      try {
        const response = await api.get(`/admin/event-types/${eventTypeId}`);
        setLeader(response.data.leader || null);
      } catch (error) {
        console.error("Ошибка загрузки ответственного:", error);
        setLeader(null);
      }
    };
    loadLeader();
  }, [eventTypeId]);

  const updateLeader = async (teacherId: number | null) => {
    setLoading(true);
    try {
      await api.post("/admin/assign_responsible", {
        teacherId,
        eventTypeId,
      });

      await queryClient.invalidateQueries({ queryKey: ["event_types"] });
      await queryClient.invalidateQueries({
        queryKey: ["event-type", eventTypeId],
      });

      const newLeader = teacherId
        ? teachers.find((t) => t.id === teacherId) || null
        : null;
      setLeader(newLeader);
      onLeaderChange?.(newLeader);

      setIsSelecting(false);
      setSearchTerm("");
    } catch (error) {
      console.error("Ошибка обновления ответственного:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-600" />
          <h3 className="font-medium text-gray-800">Ответственный</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Users className="w-3.5 h-3.5" />
            <span>Текущий:</span>
          </div>
          {!isSelecting && (
            <button
              onClick={() => setIsSelecting(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {leader ? (
                <Edit className="w-3.5 h-3.5" />
              ) : (
                <UserPlus className="w-3.5 h-3.5" />
              )}
              {leader ? "Изменить" : "Назначить"}
            </button>
          )}
        </div>

        {!isSelecting ? (
          leader ? (
            <div className="group relative flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
              <div className="flex-shrink-0">
                {leader.image ? (
                  <div className="p-0.5 bg-white rounded-full shadow-sm">
                    <img
                      src={leader.image}
                      alt={leader.display_name}
                      className="w-7 h-7 rounded-full object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">
                  {leader.display_name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3 text-gray-500" />
                  <p className="text-xs text-gray-600 truncate">
                    {leader.email}
                  </p>
                </div>
                {leader.roles?.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {leader.roles.slice(0, 2).map((role, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded-full"
                      >
                        {role}
                      </span>
                    ))}
                    {leader.roles.length > 2 && (
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                        +{leader.roles.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => updateLeader(null)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg transition-all"
                disabled={loading}
                title="Удалить"
              >
                <UserMinus className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <User className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-xs text-gray-500 text-center">
                Ответственный не назначен
              </p>
            </div>
          )
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-8 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                disabled={loading}
              />
              <Users className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-500" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex justify-between items-center px-1">
              <h4 className="text-xs font-medium text-gray-700">Выберите:</h4>
              <button
                onClick={() => {
                  setIsSelecting(false);
                  setSearchTerm("");
                }}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded-lg"
                disabled={loading}
              >
                Отмена
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8 bg-gray-50 rounded-lg">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200">
                <ul className="divide-y divide-gray-200 max-h-72 overflow-y-auto">
                  <li
                    onClick={() => !loading && updateLeader(null)}
                    className={`px-3 py-2.5 hover:bg-gray-100 cursor-pointer transition-colors ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                        <X className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      <p className="text-sm text-gray-700">— Не назначать —</p>
                    </div>
                  </li>

                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => (
                      <li
                        key={teacher.id}
                        onClick={() => !loading && updateLeader(teacher.id)}
                        className={`px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors ${
                          leader?.id === teacher.id
                            ? "bg-blue-50 border-l-2 border-l-blue-600"
                            : ""
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex-shrink-0">
                            {teacher.image ? (
                              <img
                                src={teacher.image}
                                alt={teacher.display_name}
                                className="w-7 h-7 rounded-full object-cover border border-gray-200"
                              />
                            ) : (
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                  leader?.id === teacher.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                              >
                                <User className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {teacher.display_name}
                              </p>
                              {leader?.id === teacher.id && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded-full">
                                  <Check className="w-2.5 h-2.5" />
                                  Тек
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {teacher.email}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-6 text-center">
                      <p className="text-xs text-gray-500">Ничего не найдено</p>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Boss;
