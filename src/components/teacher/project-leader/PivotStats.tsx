// components/project-office/PivotStats.tsx
import { PivotStudent } from "@/hooks/teacher/useProjectOfficePivot";
import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronRight,
  Users,
  Award,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Lightbulb,
  Filter,
  Eye,
  EyeOff,
  X,
  Settings,
  CheckSquare,
  Square,
  Search,
  Loader2,
  Check,
  AlertTriangle,
} from "lucide-react";
import api from "@/services/api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EditPriority from "./EditPriority";

interface PivotStatsProps {
  students: PivotStudent[];
  projectOfficeId?: number;
}

interface EventStat {
  id: number;
  name: string;
  total: number;
  completed: number;
  completionRate: number;
  averageScore: number;
  isInProfile?: boolean;
  is_important: boolean;
  details?: {
    topStudents: Array<{ name: string; score: number }>;
    strugglingStudents: Array<{ name: string; score: number }>;
    recommendations: string[];
  };
}

// Тип для мероприятия из API
interface ApiEvent {
  id: number;
  title: string;
  description?: string;
  is_active?: boolean;
  event_type?: string; // Добавлено поле для типа мероприятия
}

// Тип для мероприятия в модальном окне
interface ModalEvent {
  id: number;
  title: string;
  eventType?: string; // Тип мероприятия для сортировки
  isSelected: boolean;
  hasStats: boolean; // Есть ли статистика в текущих данных
}

const PivotStats: React.FC<PivotStatsProps> = ({
  students,
  // projectOfficeId = 1,
}) => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [showList, setShowList] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalEvents, setModalEvents] = useState<ModalEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [sortByEventType, setSortByEventType] = useState<boolean>(true); // Сортировка по типу мероприятия

  const queryClient = useQueryClient();
  // Запрос на отправку изменений приоритета

  // Запрос для получения всех мероприятий с сервера
  const {
    data: allApiEvents = [],
    isLoading: isLoadingEvents,
    error: eventsError,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ["all-events"],
    queryFn: async () => {
      try {
        const response = await api.get("/events/all_events");
        return response.data || [];
      } catch (error) {
        console.error("Error fetching all events:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  // Запрос для получения мероприятий проектного офиса
  const { data: projectOfficeEvents = [], isLoading: isLoadingProjectEvents } =
    useQuery({
      queryKey: ["project-office-events"],
      queryFn: async () => {
        // if (!projectOfficeId) return [];
        try {
          const response = await api.get(`/project-office/events`);
          return response.data || [];
        } catch (error) {
          console.error("Error fetching project office events:", error);
          return [];
        }
      },
      // enabled: !!projectOfficeId,
    });

  // Мутация для сохранения выбранных мероприятий
  const saveSelectedEventsMutation = useMutation({
    mutationFn: async (selectedEventIds: number[]) => {
      // if (!projectOfficeId) {
      //   throw new Error("ID проектного офиса не указан");
      // }

      const response = await api.post("/project-office/change-events-project", {
        event_ids: selectedEventIds,
      });

      return response.data;
    },
    onSuccess: () => {
      setSaveSuccess(true);
      setIsSaving(false);

      // Обновляем данные мероприятий проектного офиса

      queryClient.invalidateQueries({
        queryKey: ["project-office-events"],
      });

      // Скрываем модальное окно через 1.5 секунды
      setTimeout(() => {
        setSaveSuccess(false);
        setShowModal(false);
      }, 1500);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Ошибка при сохранении мероприятий";
      setSaveError(errorMessage);
      setIsSaving(false);
    },
  });

  // Генерация рекомендаций
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateRecommendations = (eventData: any[]): string[] => {
    const recommendations = [];
    // const completionRate =
    //   (eventData.filter(
    //     (e) => e.completed_stages_count >= e.min_stages_required
    //   ).length /
    //     eventData.length) *
    //   100;

    // if (completionRate < 50) {
    //   recommendations.push(
    //     "Низкий процент выполнения. Рекомендуется провести дополнительное занятие"
    //   );
    // }

    if (eventData.some((e) => e.total_score === 0)) {
      const notStartedCount = eventData.filter(
        (e) => e.total_score === 0
      ).length;
      recommendations.push(
        `${notStartedCount} учеников еще не начали. Нужно напомнить о мероприятии`
      );
    }

    const avgScore =
      eventData.reduce((sum, e) => sum + e.total_score, 0) / eventData.length;
    if (avgScore < 60) {
      recommendations.push(
        "Средний балл ниже 60. Рассмотрите возможность дополнительной подготовки"
      );
    }

    return recommendations.slice(0, 3);
  };

  // Инициализация модального окна
  useEffect(() => {
    if (showModal && allApiEvents.length > 0) {
      // Определяем, какие мероприятия уже выбраны (в проектный офис)
      const selectedEventIds = new Set(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projectOfficeEvents.map((event: any) => event.id)
      );

      // Получаем ID мероприятий, которые есть в статистике
      const eventIdsWithStats = new Set<number>();
      if (students.length > 0 && students[0].events) {
        Object.keys(students[0].events).forEach((key) => {
          const eventId = parseInt(key);
          if (!isNaN(eventId)) {
            eventIdsWithStats.add(eventId);
          }
        });
      }

      // Создаем массив мероприятий для модального окна
      const modalEventsData = allApiEvents.map((event: ApiEvent) => ({
        id: event.id,
        title: event.title || `Мероприятие ${event.id}`,
        eventType: event.event_type || "Без типа",
        isSelected: selectedEventIds.has(event.id),
        hasStats: eventIdsWithStats.has(event.id),
      }));

      // Сортируем мероприятия
      const sortedEvents = sortByEventType
        ? [...modalEventsData].sort((a, b) => {
            // Сначала сортируем по типу мероприятия
            const typeCompare = (a.eventType || "").localeCompare(
              b.eventType || ""
            );
            if (typeCompare !== 0) return typeCompare;
            // Затем по названию
            return a.title.localeCompare(b.title);
          })
        : modalEventsData;

      setModalEvents(sortedEvents);
    }
  }, [showModal, allApiEvents, projectOfficeEvents, students, sortByEventType]);

  // Открытие модального окна
  const handleOpenModal = () => {
    // Обновляем данные перед открытием
    refetchEvents();
    setShowModal(true);
    setSaveError(null);
    setSaveSuccess(false);
  };

  // Переключение чекбокса в модальном окне
  const toggleEventSelection = (eventId: number) => {
    setModalEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, isSelected: !event.isSelected }
          : event
      )
    );
  };

  // Сохранение выбранных мероприятий
  const handleSaveModal = () => {
    // if (!projectOfficeId) {
    //   setSaveError("ID проектного офиса не указан");
    //   return;
    // }

    const selectedEventIds = modalEvents
      .filter((event) => event.isSelected)
      .map((event) => event.id);

    setIsSaving(true);
    setSaveError(null);
    saveSelectedEventsMutation.mutate(selectedEventIds);
  };

  // // Выделение всех мероприятий
  // const selectAllEvents = () => {
  //   setModalEvents((prev) =>
  //     prev.map((event) => ({ ...event, isSelected: true }))
  //   );
  // };

  // Сброс всех выделений
  const deselectAllEvents = () => {
    setModalEvents((prev) =>
      prev.map((event) => ({ ...event, isSelected: false }))
    );
  };

  // // Выделение только мероприятий со статистикой
  // const selectEventsWithStats = () => {
  //   setModalEvents((prev) =>
  //     prev.map((event) => ({ ...event, isSelected: event.hasStats }))
  //   );
  // };

  // Фильтрация мероприятий для модального окна
  const filteredModalEvents = useMemo(() => {
    if (!searchTerm.trim()) return modalEvents;

    return modalEvents.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [modalEvents, searchTerm]);

  // Подсчет выбранных мероприятий
  const selectedEventsCount = useMemo(() => {
    return modalEvents.filter((event) => event.isSelected).length;
  }, [modalEvents]);

  // // Подсчет мероприятий со статистикой
  // const eventsWithStatsCount = useMemo(() => {
  //   return modalEvents.filter((event) => event.hasStats).length;
  // }, [modalEvents]);

  // Собираем статистику по мероприятиям из данных students
  const eventStats: EventStat[] = useMemo(() => {
    if (students.length === 0) return [];

    const allEventIds = Object.keys(students[0].events || {});

    return allEventIds.map((eventId) => {
      const eventIdNum = parseInt(eventId);
      const eventName =
        students[0]?.events[eventId]?.event_name || "Неизвестно";
      const eventData = students
        .map((student) => student.events[eventId])
        .filter((event) => event);

      // Сортируем студентов по результатам
      const sortedByScore = [...eventData]
        .filter((e) => e.total_score > 0)
        .sort((a, b) => b.total_score - a.total_score)
        .slice(0, 3)
        .map((e) => ({
          name:
            students.find((s) => s.events[eventId] === e)?.student_name ||
            "Неизвестно",
          score: e.total_score,
        }));

      // Находим студентов с низкими результатами
      const struggling = [...eventData]
        .filter((e) => e.total_score > 0 && e.total_score < 50)
        .slice(0, 3)
        .map((e) => ({
          name:
            students.find((s) => s.events[eventId] === e)?.student_name ||
            "Неизвестно",
          score: e.total_score,
        }));

      // Генерируем рекомендации
      const recommendations = generateRecommendations(eventData);

      const completedInEvent = eventData.filter(
        (event) => event.completed_stages_count >= event.min_stages_required
      ).length;

      const averageEventScore =
        eventData.length > 0
          ? eventData.reduce(
              (sum, event) => sum + (event.total_score || 0),
              0
            ) / eventData.length
          : 0;
      const projectOfficeEvent = projectOfficeEvents.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (event: any) => event.id === eventIdNum
      );
      const isImportant = projectOfficeEvent
        ? projectOfficeEvent.is_important === true
        : false;
      // Проверяем, находится ли мероприятие в проекте

      console.log(projectOfficeEvents);
      return {
        id: eventIdNum,
        name: eventName,
        total: eventData.length,
        is_important: isImportant,
        completed: completedInEvent,
        completionRate:
          eventData.length > 0
            ? (completedInEvent / eventData.length) * 100
            : 0,
        averageScore: averageEventScore,
        // isInProfile: isInProject,
        details: {
          topStudents: sortedByScore,
          strugglingStudents: struggling,
          recommendations,
        },
      };
    });
  }, [students, projectOfficeEvents]);

  // Общая статистика
  const totalStats = useMemo(() => {
    const totalStudents = students.length;
    const totalEvents = eventStats.length;
    const totalCompleted = eventStats.reduce(
      (sum, event) => sum + event.completed,
      0
    );
    const totalPossible = eventStats.reduce(
      (sum, event) => sum + event.total,
      0
    );
    const overallCompletionRate =
      totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
    const averageScore =
      eventStats.length > 0
        ? eventStats.reduce((sum, event) => sum + event.averageScore, 0) /
          eventStats.length
        : 0;

    // Подсчет мероприятий в проекте
    const eventsInProject = eventStats.filter(
      (event) => event.isInProfile
    ).length;

    return {
      totalStudents,
      totalEvents,
      overallCompletionRate,
      averageScore: averageScore.toFixed(1),
      totalCompleted,
      eventsInProject,
    };
  }, [eventStats, students.length]);

  // Получение цвета для прогресса
  const getProgressColor = (rate: number) => {
    if (rate >= 80) return "text-emerald-400";
    if (rate >= 60) return "text-green-400";
    if (rate >= 40) return "text-yellow-400";
    if (rate >= 20) return "text-orange-400";
    return "text-red-400";
  };

  // Получение цвета для фона прогресса
  const getProgressBgColor = (rate: number) => {
    if (rate >= 80) return "bg-emerald-500";
    if (rate >= 60) return "bg-green-500";
    if (rate >= 40) return "bg-yellow-500";
    if (rate >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  // Получение иконки для статуса
  const getStatusIcon = (rate: number) => {
    if (rate >= 80) return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    if (rate >= 60) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (rate >= 40) return <Clock className="w-5 h-5 text-yellow-400" />;
    if (rate >= 20) return <AlertCircle className="w-5 h-5 text-orange-400" />;
    return <AlertCircle className="w-5 h-5 text-red-400" />;
  };

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10 shadow-xl">
        {/* Заголовок и управление */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-400" />
              Статистика мероприятий
            </h3>
            <p className="text-gray-300 text-sm mt-1">
              Раскройте мероприятие для детальной аналитики и рекомендаций
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Кнопка управления мероприятиями проекта */}
            <button
              onClick={handleOpenModal}
              disabled={isLoadingEvents || isLoadingProjectEvents}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-colors text-sm text-emerald-300 border border-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingProjectEvents ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
              Управление мероприятиями
            </button>

            {/* Кнопка скрыть/показать список */}
            <button
              onClick={() => setShowList(!showList)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm text-white"
            >
              {showList ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Скрыть список
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Показать список
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ошибка загрузки мероприятий */}
        {eventsError && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Ошибка загрузки данных мероприятий</span>
            </div>
          </div>
        )}

        {/* Общая статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">Учеников</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {totalStats.totalStudents}
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">Мероприятий</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {totalStats.eventsInProject}
            </div>
            <div className="text-xs text-emerald-400 mt-1">
              {totalStats.eventsInProject} в проекте
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-gray-300">Выполнено</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {totalStats.overallCompletionRate.toFixed(1)}%
            </div>
          </div>

          {/* <div className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-300">Средний балл</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {totalStats.averageScore}
            </div>
          </div> */}
        </div>

        {/* Список мероприятий с аккордеоном */}
        {showList ? (
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-white">
                Список мероприятий проекта
                <span className="text-sm text-gray-400 ml-2">
                  ({totalStats.eventsInProject} в проекте)
                </span>
              </h4>
            </div>

            {eventStats.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Нет данных о мероприятиях проекта
              </div>
            ) : (
              eventStats.map((event) => (
                <div
                  key={event.id}
                  className={`bg-white/10 rounded-xl border transition-all duration-300 ${
                    expandedEvent === event.id.toString()
                      ? "border-emerald-500/30 bg-white/15"
                      : "border-white/10 hover:border-white/20 hover:bg-white/15"
                  } ${event.isInProfile ? "border-l-4 border-l-emerald-500" : ""}`}
                >
                  {/* Заголовок мероприятия */}
                  <div className="w-full p-4 flex items-center justify-between text-left">
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() =>
                          setExpandedEvent(
                            expandedEvent === event.id.toString()
                              ? null
                              : event.id.toString()
                          )
                        }
                        className={`p-2 rounded-lg transition-all ${
                          expandedEvent === event.id.toString()
                            ? "bg-emerald-500/20 transform rotate-90"
                            : "bg-white/10"
                        }`}
                      >
                        <ChevronRight className="w-5 h-5 text-emerald-400 transition-transform" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5
                            className="font-semibold text-white truncate"
                            title={event.name}
                          >
                            {event.name}
                          </h5>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            {getStatusIcon(event.completionRate)}
                            <span
                              className={`font-medium ${getProgressColor(event.completionRate)}`}
                            >
                              {event.completionRate.toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {event.completed} из {event.total} учеников
                          </div>
                          {/* <div className="text-sm text-yellow-300 font-medium">
                            Средний балл: {event.averageScore.toFixed(1)}
                          </div> */}
                        </div>
                      </div>
                    </div>

                    <EditPriority
                      priority={event.is_important}
                      eventId={event.id}
                    />
                  </div>

                  {/* Раскрывающийся контент */}
                  {expandedEvent === event.id.toString() && event.details && (
                    <div className="px-4 pb-4 border-t border-white/10 pt-4 animate-fadeIn">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Прогресс выполнения */}
                        <div className="space-y-4">
                          <h6 className="font-medium text-white flex items-center gap-2">
                            <Target className="w-4 h-4 text-emerald-400" />
                            Прогресс выполнения
                          </h6>

                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm text-gray-300 mb-1">
                                <span>Выполнение мероприятия</span>
                                <span>{event.completionRate.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-3">
                                <div
                                  className={`h-3 rounded-full ${getProgressBgColor(event.completionRate)}`}
                                  style={{ width: `${event.completionRate}%` }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-sm text-gray-300 mb-1">
                                <span>Средний балл</span>

                                <span>
                                  {event.averageScore.toFixed(1)} из 100
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-3">
                                <div
                                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                  style={{ width: `${event.averageScore}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-sm text-gray-300">
                                Зачтено
                              </div>
                              <div className="text-xl font-bold text-emerald-400">
                                {event.completed}
                              </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-sm text-gray-300">Всего</div>
                              <div className="text-xl font-bold text-white">
                                {event.total}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Лучшие ученики */}
                        <div className="space-y-4">
                          <h6 className="font-medium text-white flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            Лучшие результаты
                          </h6>

                          <div className="space-y-2">
                            {event.details.topStudents.length > 0 ? (
                              event.details.topStudents.map(
                                (student, index) => (
                                  <div
                                    key={`${student.name}-${index}`}
                                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                          index === 0
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : index === 1
                                              ? "bg-gray-500/20 text-gray-300"
                                              : "bg-orange-500/20 text-orange-300"
                                        }`}
                                      >
                                        <span className="text-xs font-bold">
                                          #{index + 1}
                                        </span>
                                      </div>
                                      <span className="text-white truncate">
                                        {student.name}
                                      </span>
                                    </div>
                                    <span className="font-bold text-emerald-400">
                                      {student.score.toFixed(1)} баллов
                                    </span>
                                  </div>
                                )
                              )
                            ) : (
                              <div className="text-center text-gray-400 py-2">
                                Нет данных
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Рекомендации */}
                        <div className="space-y-4">
                          <h6 className="font-medium text-white flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-blue-400" />
                            Рекомендации
                          </h6>

                          <div className="space-y-3">
                            {event.details.recommendations.length > 0 ? (
                              event.details.recommendations.map(
                                (rec, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 transition-colors"
                                  >
                                    <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-white text-sm">
                                      {rec}
                                    </span>
                                  </div>
                                )
                              )
                            ) : (
                              <div className="text-center text-gray-400 py-4">
                                Все хорошо! Продолжайте в том же духе.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Когда список скрыт - показываем кнопки действий */
          <div className="bg-white/10 rounded-xl p-8 text-center border border-white/10 mb-6">
            <div className="max-w-md mx-auto">
              <Target className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">
                Список мероприятий скрыт
              </h4>
              {/* <p className="text-gray-300 mb-6">
                Нажмите "Показать список" для просмотра мероприятий проекта или
                "Управление мероприятиями" для настройки
              </p> */}
              {/* <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowList(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  <Eye className="w-4 h-4" />
                  Показать список
                </button>
                <button
                  onClick={handleOpenModal}
                  disabled={isLoadingEvents || isLoadingProjectEvents}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-colors text-emerald-300 border border-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingProjectEvents ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Settings className="w-4 h-4" />
                  )}
                  Управление мероприятиями
                </button>
              </div> */}
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно управления мероприятиями */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-white/10 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Хедер модального окна */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Settings className="w-6 h-6 text-emerald-400" />
                    Управление мероприятиями проекта
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    Выберите мероприятия, которые будут в проекте.
                    {/* <span className="text-emerald-300 ml-1">
                      {eventsWithStatsCount} из {modalEvents.length} имеют
                      статистику
                    </span> */}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Поиск и управление сортировкой */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск мероприятий..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoadingEvents}
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center gap-4">
                  {/* Переключатель сортировки по типу мероприятия */}
                  <button
                    onClick={() => setSortByEventType(!sortByEventType)}
                    disabled={isLoadingEvents}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Filter className="w-4 h-4" />
                    {sortByEventType ? "По типу" : "Без сортировки"}
                  </button>

                  <div className="text-sm text-gray-300">
                    Выбрано:{" "}
                    <span className="text-emerald-400 font-bold">
                      {selectedEventsCount}
                    </span>{" "}
                    из {modalEvents.length}
                  </div>
                  {isLoadingEvents && (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  )}
                </div>
              </div>
            </div>

            {/* Тело модального окна */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {isLoadingEvents ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  <span className="ml-3 text-gray-300">
                    Загрузка мероприятий...
                  </span>
                </div>
              ) : modalEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Нет доступных мероприятий
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredModalEvents.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      Мероприятия не найдены по запросу "{searchTerm}"
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Группировка по типам мероприятий (если включена сортировка) */}
                      {sortByEventType ? (
                        // Группировка мероприятий по типам
                        (() => {
                          const groupedEvents: Record<string, ModalEvent[]> =
                            {};

                          filteredModalEvents.forEach((event) => {
                            const eventType = event.eventType || "Без типа";
                            if (!groupedEvents[eventType]) {
                              groupedEvents[eventType] = [];
                            }
                            groupedEvents[eventType].push(event);
                          });

                          // Сортируем группы по названию типа
                          const sortedGroups = Object.entries(
                            groupedEvents
                          ).sort(([typeA], [typeB]) =>
                            typeA.localeCompare(typeB)
                          );

                          return sortedGroups.map(([eventType, events]) => (
                            <div key={eventType} className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="h-px flex-1 bg-white/10"></div>
                                <h4 className="text-sm font-medium text-gray-300 px-3">
                                  {eventType}
                                </h4>
                                <div className="h-px flex-1 bg-white/10"></div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {events.map((event) => (
                                  <div
                                    key={event.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                                      event.isSelected
                                        ? "border-emerald-500/30 bg-emerald-500/10"
                                        : "border-white/10 hover:border-white/20 hover:bg-white/10"
                                    } ${!event.hasStats ? "opacity-75" : ""}`}
                                  >
                                    <button
                                      onClick={() =>
                                        toggleEventSelection(event.id)
                                      }
                                      disabled={isSaving}
                                      className="flex-shrink-0 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {event.isSelected ? (
                                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                                      ) : (
                                        <Square className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                                      )}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-white truncate">
                                          {event.title}
                                        </h4>
                                        {/* {!event.hasStats && (
                                          <span className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded-full">
                                            Без статистики
                                          </span>
                                        )} */}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ));
                        })()
                      ) : (
                        // Простой список без группировки
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredModalEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                                event.isSelected
                                  ? "border-emerald-500/30 bg-emerald-500/10"
                                  : "border-white/10 hover:border-white/20 hover:bg-white/10"
                              } ${!event.hasStats ? "opacity-75" : ""}`}
                            >
                              <button
                                onClick={() => toggleEventSelection(event.id)}
                                disabled={isSaving}
                                className="flex-shrink-0 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {event.isSelected ? (
                                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                                ) : (
                                  <Square className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-white truncate">
                                    {event.title}
                                  </h4>
                                  {!event.hasStats && (
                                    <span className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded-full">
                                      Без статистики
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400">
                                  ID: {event.id}
                                  {event.eventType && ` • ${event.eventType}`}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Подсказка */}
              <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-white">
                      <span className="font-medium">Подсказка:</span> Выбранные
                      мероприятия будут отображаться в статистике проекта.
                      <span className="text-gray-300 ml-1">
                        Мероприятия без статистики не имеют данных о выполнении
                        учениками.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Футер модального окна */}
            <div className="p-6 border-t border-white/10">
              {saveError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    {saveError}
                  </div>
                </div>
              )}

              {saveSuccess && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <Check className="w-4 h-4" />
                    Мероприятия успешно обновлены
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {/* <button
                    onClick={selectAllEvents}
                    disabled={isSaving || isLoadingEvents}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Выбрать все
                  </button> */}
                  <button
                    onClick={deselectAllEvents}
                    disabled={isSaving || isLoadingEvents}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Square className="w-4 h-4" />
                    Сбросить все
                  </button>
                  {/* <button
                    onClick={selectEventsWithStats}
                    disabled={isSaving || isLoadingEvents}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors text-sm text-blue-300 border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Target className="w-4 h-4" />
                    Только со статистикой
                  </button> */}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={isSaving}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSaveModal}
                    disabled={isSaving || isLoadingEvents}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-4 h-4" />
                        Сохранить ({selectedEventsCount})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PivotStats;
