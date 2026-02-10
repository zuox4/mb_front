import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  Phone,
  User,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Mail,
  BookOpen,
  EyeIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import api from "@/services/api/api";

// Типы данных
interface Teacher {
  id: number;
  display_name: string;
  phone: string;
  lastLogin: string;
  email: string;
  avatar?: string;
}

interface Student {
  id: number;
  display_name: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  email?: string;
}

interface ClassInfo {
  id: number;
  name: string;
  grade: number;
  letter: string;
  studentCount: number;
}

type SortField = "name" | "email" | "lastLogin" | "status";
type SortDirection = "asc" | "desc";

const GroupInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api(`/groups/${id}`);
        setClassInfo(response.data.group);

        // Сортируем студентов по алфавиту при загрузке
        const sortedStudents = response.data.students.sort(
          (a: Student, b: Student) =>
            a.display_name.localeCompare(b.display_name, "ru"),
        );
        setStudents(sortedStudents);

        setTeacher(response.data.teacher);
        setError(null);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Ошибка при загрузке данных");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Обработчик сортировки
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Фильтрация и сортировка учеников
  const filteredStudents = useMemo(() => {
    const filtered = students.filter((student) => {
      const matchesSearch =
        searchQuery === "" ||
        student.display_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesActiveFilter = !showOnlyActive || student.isActive;

      return matchesSearch && matchesActiveFilter;
    });

    // Сортировка
    return [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "name":
          aValue = a.display_name;
          bValue = b.display_name;
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue, "ru")
            : bValue.localeCompare(aValue, "ru");

        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);

        case "lastLogin":
          aValue = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
          bValue = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;

        case "status":
          aValue = a.isActive ? 1 : 0;
          bValue = b.isActive ? 1 : 0;
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;

        default:
          return 0;
      }
    });
  }, [searchQuery, showOnlyActive, students, sortField, sortDirection]);

  // Форматирование даты
  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return "Никогда";

    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) {
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60),
      );
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60),
        );
        if (diffInMinutes < 1) return "Только что";
        return `${diffInMinutes} мин. назад`;
      }
      return `${diffInHours} час. назад`;
    } else if (diffInDays === 1) {
      return "Вчера";
    } else if (diffInDays < 7) {
      return `${diffInDays} дн. назад`;
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  // Иконка сортировки
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
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

  if (!classInfo || !teacher) {
    return null;
  }

  return (
    <div className="font-codec text-white">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white ">
            Класс {classInfo.name}
          </h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
            <Users className="w-4 h-4 mr-1" />
            {classInfo.studentCount} учеников
          </span>
        </div>
      </div>

      {/* Карточка классного руководителя */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white/10 border-4 border-white/20">
              {teacher.avatar ? (
                <img
                  src={teacher.avatar}
                  alt={teacher.display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-white/60" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-medium text-white/70 mb-2">
              Классный руководитель
            </h2>
            <h3 className="text-3xl font-bold text-white mb-6">
              {teacher.display_name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 backdrop-blur-sm flex items-center justify-center border border-blue-500/30">
                  <Phone className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Телефон</p>
                  <p className="font-medium text-white">{teacher.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center border border-emerald-500/30">
                  <Mail className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Email</p>
                  <p className="font-medium text-white">{teacher.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 backdrop-blur-sm flex items-center justify-center border border-purple-500/30">
                  <BookOpen className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Класс</p>
                  <p className="font-medium text-white">{classInfo.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 backdrop-blur-sm flex items-center justify-center border border-amber-500/30">
                  <Clock className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Последний вход</p>
                  <p className="font-medium text-white">
                    {formatRelativeTime(teacher.lastLogin)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Список учеников */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Ученики класса
              </h2>
              <p className="text-white/60 text-sm">
                Всего: {students.length} учеников • Активных:{" "}
                {students.filter((s) => s.isActive).length}
              </p>
            </div>

            {/* Фильтры и поиск */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск по имени..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showOnlyActive}
                      onChange={(e) => setShowOnlyActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500/50"></div>
                  </div>
                  <span className="text-white/80 text-sm">Только активные</span>
                </label>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20">
                  <Filter className="w-4 h-4 mr-1" />
                  Найдено: {filteredStudents.length}
                </span>
              </div>
            </div>
          </div>
          <div className="h-px bg-white/10 mt-4"></div>
        </div>

        {/* Таблица учеников */}
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/10 backdrop-blur-sm">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:bg-white/15 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Ученик
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:bg-white/15 transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-1">
                    Email
                    <SortIcon field="email" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:bg-white/15 transition-colors"
                  onClick={() => handleSort("lastLogin")}
                >
                  <div className="flex items-center gap-1">
                    Последний вход
                    <SortIcon field="lastLogin" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:bg-white/15 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Статус
                    <SortIcon field="status" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id + student.display_name}
                  className="hover:bg-white/10 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.display_name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 backdrop-blur-sm border-2 border-blue-500/30 flex items-center justify-center">
                            <span className="font-medium text-blue-300">
                              {student.display_name[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {student.display_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white/80">{student.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {student.lastLogin ? (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span className="text-white/90">
                          {formatRelativeTime(student.lastLogin)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-white/40">Никогда</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border ${
                        student.isActive
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}
                    >
                      {student.isActive ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Активен
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Неактивен
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/20 mb-4">
                <Search className="w-16 h-16 mx-auto opacity-30" />
              </div>
              <p className="text-white/60 text-lg mb-2">
                {searchQuery ? "Ученики не найдены" : "Список учеников пуст"}
              </p>
              <p className="text-white/40 text-sm">
                {searchQuery
                  ? "Попробуйте изменить поисковый запрос"
                  : "В этом классе пока нет учеников"}
              </p>
            </div>
          )}
        </div>

        {/* Подсказка */}
        {filteredStudents.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <div className="text-white/60">
                Нажмите на иконку <EyeIcon className="w-4 h-4 inline mx-1" />{" "}
                для просмотра подробной информации об ученике
              </div>
              <div className="text-white/40">
                Сортировка:{" "}
                {sortField === "name"
                  ? "по имени"
                  : sortField === "email"
                    ? "по email"
                    : sortField === "lastLogin"
                      ? "по дате входа"
                      : "по статусу"}
                ({sortDirection === "asc" ? "А-Я" : "Я-А"})
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно с информацией об ученике */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedStudent.display_name}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border ${
                      selectedStudent.isActive
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30"
                    }`}
                  >
                    {selectedStudent.isActive ? "Активен" : "Неактивен"}
                  </span>
                  <span className="text-white/60 text-sm">
                    ID: {selectedStudent.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Фото */}
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  {selectedStudent.avatar ? (
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.display_name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center">
                      <User className="w-20 h-20 text-white/60" />
                    </div>
                  )}
                </div>
              </div>

              {/* Информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-white/60" />
                    <h4 className="font-medium text-white">Email</h4>
                  </div>
                  <p className="text-white/90">
                    {selectedStudent.email || "Не указан"}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-white/60" />
                    <h4 className="font-medium text-white">Последний вход</h4>
                  </div>
                  <p className="text-white/90">
                    {selectedStudent.lastLogin
                      ? formatRelativeTime(selectedStudent.lastLogin)
                      : "Никогда"}
                  </p>
                </div>
              </div>

              {/* Класс */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-white/60" />
                  <h4 className="font-medium text-white">Класс</h4>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {classInfo?.name.split("-")[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{classInfo?.name}</p>
                    <p className="text-white/60 text-sm">
                      Классный руководитель: {teacher.display_name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button className="flex-1 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Написать
                </button>
                <button className="flex-1 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg border border-emerald-500/30 transition-colors flex items-center justify-center gap-2">
                  <EyeIcon className="w-4 h-4" />
                  Подробная статистика
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupInfoPage;
