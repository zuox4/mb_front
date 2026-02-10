import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  BarChart3,
  Award,
  Target,
  TrendingUp,
  Shield,
  School,
  FileText,
  Settings,
  UserCheck,
  Bell,
  Clock,
  Download,
  Star,
  CheckCircle,
} from "lucide-react";

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalEvents: number;
  activeProjects: number;
  pendingActivations: number;
  todayLogins: number;
  completedEvents: number;
}

const AdminWelcomePage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Загрузка статистики (заглушка - замените на реальные API)
        const mockStats: Stats = {
          totalStudents: 245,
          totalTeachers: 18,
          totalClasses: 12,
          totalEvents: 36,
          activeProjects: 8,
          pendingActivations: 7,
          todayLogins: 142,
          completedEvents: 24,
        };
        setStats(mockStats);

        // Загрузка последних активностей
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Создать мероприятие",
      description: "Добавить новое мероприятие",
      icon: Calendar,
      color: "bg-blue-500/20 text-blue-400",
      borderColor: "border-blue-500/30",
      onClick: () => navigate("events"),
    },
    {
      title: "Управление классами",
      description: "Просмотр и редактирование классов",
      icon: School,
      color: "bg-emerald-500/20 text-emerald-400",
      borderColor: "border-emerald-500/30",
      onClick: () => navigate("groups"),
    },
    {
      title: "Проектные офисы",
      description: "Управление проектными офисами",
      icon: Target,
      color: "bg-purple-500/20 text-purple-400",
      borderColor: "border-purple-500/30",
      onClick: () => navigate("project-offices"),
    },
    {
      title: "Статистика",
      description: "Аналитика и отчеты",
      icon: BarChart3,
      color: "bg-amber-500/20 text-amber-400",
      borderColor: "border-amber-500/30",
      onClick: () => navigate("/admin/analytics"),
    },
  ];

  const adminCapabilities = [
    {
      icon: Calendar,
      title: "Создание типов мероприятий",
      description: "Определяйте категории и типы мероприятий для системы",
    },
    {
      icon: Award,
      title: "Создание мероприятий",
      description: "Добавляйте новые мероприятия и закрепляйте их за типами",
    },
    {
      icon: BarChart3,
      title: "Статистика по проектному офису",
      description: "Отслеживайте выполнение мероприятий в проектном офисе",
    },
    {
      icon: School,
      title: "Статистика в классах",
      description: "Анализируйте активность и успеваемость по классам",
    },
    {
      icon: Users,
      title: "Активность пользователей",
      description: "Мониторинг активности учителей и учеников",
    },
    {
      icon: Star,
      title: "Назначение важности мероприятий",
      description: "Определяйте важные и неважные мероприятия проектного офиса",
    },
    {
      icon: FileText,
      title: "Отчеты по ученикам",
      description: "Детальные отчеты по прогрессу каждого ученика",
    },
    {
      icon: TrendingUp,
      title: "Прогресс в проектном офисе",
      description: "Отслеживание прогресса учеников в проектном офисе школы",
    },
  ];

  return (
    <div className="min-h-screen text-white p-6 font-codec">
      {/* Приветствие */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Добро пожаловать!
            </h1>
            <p className="text-gray-400 text-lg">
              Добро пожаловать в панель управления образовательной организацией
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-sm"></span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <School className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Панель управления образовательной организацией
              </h2>
              <p className="text-white/80">
                В панели управления вы можете создавать типы мероприятий,
                создавать мероприятия и закреплять их за типами мероприятий,
                смотреть статистику по проектному офису выполнения мероприятий,
                статистику в классах, активность пользователей, назначать важные
                и не важные мероприятия проектного офиса, а также смотреть отчет
                по каждому ученику и его прогрессу в проектном офисе школы.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрый доступ */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Быстрый доступ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border ${action.borderColor} hover:bg-white/10 transition-all duration-200 group text-left`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{action.title}</h3>
                    <p className="text-sm text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Нажмите для перехода
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <svg
                      className="w-3 h-3 text-white"
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
              </button>
            );
          })}
        </div>
      </div>

      {/* Статистика */}
      {stats && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Общая статистика
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {stats.totalStudents}
                  </div>
                  <div className="text-sm text-white/60">Учеников</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {stats.totalTeachers}
                  </div>
                  <div className="text-sm text-white/60">Учителей</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <School className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {stats.totalClasses}
                  </div>
                  <div className="text-sm text-white/60">Классов</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {stats.totalEvents}
                  </div>
                  <div className="text-sm text-white/60">Мероприятий</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-rose-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {stats.activeProjects}
                  </div>
                  <div className="text-sm text-white/60">Проектов</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {stats.pendingActivations}
                  </div>
                  <div className="text-sm text-white/60">На активации</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {stats.todayLogins}
                  </div>
                  <div className="text-sm text-white/60">Входов сегодня</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-orange-300" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    {stats.completedEvents}
                  </div>
                  <div className="text-sm text-white/60">Завершено</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Возможности администратора */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          Возможности панели управления
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminCapabilities.map((capability, index) => {
            const Icon = capability.icon;
            const colors = [
              "bg-blue-500/20 text-blue-400 border-blue-500/30",
              "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
              "bg-purple-500/20 text-purple-400 border-purple-500/30",
              "bg-amber-500/20 text-amber-400 border-amber-500/30",
            ];
            const colorClass = colors[index % colors.length];

            return (
              <div
                key={index}
                className={`bg-white/5 backdrop-blur-sm rounded-xl p-5 border ${colorClass.split(" ")[2]} transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${colorClass.split(" ")[0]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white">{capability.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {capability.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Информация о системе */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Система управления проектным обучением
            </h3>
            <p className="text-gray-400 mb-4">
              Современная платформа для организации проектной деятельности в
              образовательном учреждении
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Мониторинг проектов</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Аналитика успеваемости</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Управление мероприятиями</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/admin/settings")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Настройки системы
            </button>
            <button
              onClick={() => navigate("/admin/reports")}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Экспорт отчетов
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcomePage;
