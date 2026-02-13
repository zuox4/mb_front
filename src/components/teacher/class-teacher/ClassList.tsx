import api from "@/services/api/api";
import { useEffect, useState } from "react";
import {
  Edit2,
  Mail,
  User,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  Save,
  //   Trophy,
  //   Target,
  CheckCircle,
  Users,
  //   Calendar,
  Award,
  //   TrendingUp,
  //   Activity,
  //   Star,
  Clock,
} from "lucide-react";

type Student = {
  id: number;
  is_active: boolean;
  display_name: string;
  email: string;

  group_name: string;
  phone: string | null;
  email_verified_at: string | null;
  verification_sent_at: string | null;
  archived: boolean;
  created_at: string;
  is_verified: boolean;
  updated_at: string;
};

// interface EventStats {
//   totalEvents: number;
//   completedEvents: number;
//   activeEvents: number;
//   upcomingEvents: number;
//   averageScore: number;
//   participationRate: number;
//   topStudents: number;
// }

const ClassList = ({ classId }: { classId: number }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Student>>({});
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  //   const [eventStats, setEventStats] = useState<EventStats | null>(null);
  //   const [statsLoading, setStatsLoading] = useState(false);

  // Загрузка статистики по мероприятиям
  //   useEffect(() => {
  //     const loadEventStats = async () => {
  //       setStatsLoading(true);
  //       try {
  //         // Заглушка - в реальном приложении замените на реальный API
  //         const mockStats: EventStats = {
  //           totalEvents: 12,
  //           completedEvents: 8,
  //           activeEvents: 3,
  //           upcomingEvents: 1,
  //           averageScore: 87,
  //           participationRate: 92,
  //           topStudents: 5,
  //         };
  //         setEventStats(mockStats);
  //       } catch (err) {
  //         console.error("Ошибка загрузки статистики мероприятий:", err);
  //       } finally {
  //         setStatsLoading(false);
  //       }
  //     };

  //     loadEventStats();
  //   }, [classId]);

  const updateStudent = async (studentId: number, data: Partial<Student>) => {
    try {
      await api.patch(`/student/${studentId}`, data);
      // Обновляем локальное состояние
      setStudents(
        students.map((student) =>
          student.id === studentId ? { ...student, ...data } : student,
        ),
      );
      return true;
    } catch (err) {
      console.error("Ошибка при обновлении:", err);
      return false;
    }
  };

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const response = await api.get<Student[]>(
          `/groups/for_group_leader/${classId}`,
        );
        setStudents(response.data);
        setError(null);
      } catch (err) {
        setError("Ошибка при загрузке данных");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [classId]);

  // Статистика по студентам
  const studentStats = {
    total: students.length,
    is_active: students.filter((s) => s.is_active).length,
    pending: students.length - students.filter((s) => s.is_active).length,
    archived: students.filter((s) => s.archived).length,
  };

  const toggleRow = (id: number) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
  };

  const startEdit = (student: Student) => {
    setEditingId(student.id);
    setEditData({
      display_name: student.display_name,
      email: student.email,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (studentId: number) => {
    if (await updateStudent(studentId, editData)) {
      setEditingId(null);
      setEditData({});
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 backdrop-blur-sm border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Статистика по мероприятиям
      {eventStats && (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Статистика по мероприятиям
              </h2>
              <p className="text-white/60 text-sm">
                Обзор активности класса в проектах и мероприятиях
              </p>
            </div>
            {statsLoading && (
              <Loader2 className="w-5 h-5 animate-spin text-white/60" />
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {eventStats.totalEvents}
                  </div>
                  <div className="text-sm text-white/60">Всего мероприятий</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {eventStats.completedEvents}
                  </div>
                  <div className="text-sm text-white/60">Завершено</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {eventStats.activeEvents}
                  </div>
                  <div className="text-sm text-white/60">Активных</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {eventStats.upcomingEvents}
                  </div>
                  <div className="text-sm text-white/60">Предстоящих</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-rose-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {eventStats.averageScore}%
                  </div>
                  <div className="text-sm text-white/60">Средний балл</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {eventStats.participationRate}%
                  </div>
                  <div className="text-sm text-white/60">Участие</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {eventStats.topStudents}
                  </div>
                  <div className="text-sm text-white/60">Лучших учеников</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">+15%</div>
                  <div className="text-sm text-white/60">Прогресс</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Статистика по ученикам */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Статистика по ученикам
            </h2>
            <p className="text-white/60 text-sm">
              Общая информация об учениках класса
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Обновлено: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {studentStats.total}
                </div>
                <div className="text-sm text-white/60">Всего учеников</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {studentStats.is_active}
                </div>
                <div className="text-sm text-white/60">Активированы</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {studentStats.pending}
                </div>
                <div className="text-sm text-white/60">Требуют активации</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(
                    (studentStats.is_active / studentStats.total) * 100,
                  )}
                  %
                </div>
                <div className="text-sm text-white/60">Процент активации</div>
              </div>
            </div>
          </div>
        </div>

        {/* Прогресс-бар активации */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>Прогресс активации аккаунтов</span>
            <span>
              {studentStats.is_active}/{studentStats.total}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{
                width: `${(studentStats.is_active / studentStats.total) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Список учеников */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Список учеников
            </h2>
            <p className="text-white/60 text-sm">
              {students.length} учеников • {studentStats.is_active} активированы
            </p>
          </div>
          <div className="text-sm text-white/40">
            Нажмите на ученика для подробной информации
          </div>
        </div>

        <div className="space-y-3">
          {students.map((student) => {
            const isExpanded = expandedRows.has(student.id);
            const isEditing = editingId === student.id;

            return (
              <div
                key={student.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:bg-white/15 transition-all duration-200"
              >
                {/* Основная информация */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    {/* Левый блок: ФИО и статус */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-300" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 font-codec-news">
                            <span className="font-bold text-white text-lg">
                              {student.display_name}
                            </span>

                            {/* Статус активации */}
                            {!student.is_active && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs border border-amber-500/30">
                                <AlertCircle className="w-3 h-3" />
                                <span>Требуется активация</span>
                              </span>
                            )}
                            {student.is_verified && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs border border-emerald-500/30">
                                <CheckCircle className="w-3 h-3" />
                                <span>Активирован</span>
                              </span>
                            )}
                          </div>

                          {/* Email */}
                          <div className="flex items-center gap-2 text-white/80 mt-1">
                            <Mail className="w-4 h-4 text-white/60" />
                            {isEditing ? (
                              <input
                                type="email"
                                value={editData.email || student.email}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    email: e.target.value,
                                  })
                                }
                                className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                              />
                            ) : (
                              <span className="text-white/90">
                                {student.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Правый блок: кнопки */}
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEdit(student.id)}
                            className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg border border-emerald-500/30 transition-colors"
                            title="Сохранить"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 transition-colors"
                            title="Отменить"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(student)}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleRow(student.id)}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Расширенная информация */}
                {isExpanded && (
                  <div className="p-4 bg-white/5 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/60 mb-1">ID ученика</div>
                        <div className="text-white font-mono">{student.id}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/60 mb-1">Дата создания</div>
                        <div className="text-white">
                          {new Date(student.created_at).toLocaleDateString(
                            "ru-RU",
                          )}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/60 mb-1">
                          Последнее обновление
                        </div>
                        <div className="text-white">
                          {new Date(student.updated_at).toLocaleDateString(
                            "ru-RU",
                          )}
                        </div>
                      </div>
                      {student.verification_sent_at && (
                        <div className="bg-white/5 rounded-lg p-3 md:col-span-3">
                          <div className="text-white/60 mb-1">
                            Верификация отправлена
                          </div>
                          <div className="text-white">
                            {new Date(
                              student.verification_sent_at,
                            ).toLocaleDateString("ru-RU")}
                          </div>
                        </div>
                      )}
                      {student.phone && (
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-white/60 mb-1">Телефон</div>
                          <div className="text-white">{student.phone}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {students.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/20 mb-4">
              <Users className="w-16 h-16 mx-auto opacity-30" />
            </div>
            <p className="text-white/60 text-lg mb-2">В классе нет учеников</p>
            <p className="text-white/40 text-sm">
              Добавьте учеников через административную панель
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassList;
