import api from "@/services/api/api";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Target } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string | null;
  academic_year: string;
  date_start: string | null;
  date_end: string | null;
  is_active: boolean;
  event_type_id: number;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/events/all_events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // const formatDate = (dateString: string | null) => {
  //   if (!dateString) return "";
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("ru-RU", {
  //     day: "numeric",
  //     month: "short",
  //     year: "numeric",
  //   });
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b ">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/10 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b ">
      <div className="container mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Мероприятия школы
          </h1>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-6 mb-8">
          {/* Фон с градиентом */}
          <div className="absolute inset-0 bg-gradient-to-r from-sch-green-light/20 sch-green-light/20 to-sch-green-light/20 backdrop-blur-xl" />

          {/* Текстура */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />

          {/* Обводка */}
          <div className="absolute inset-0 rounded-2xl border border-white/20" />

          <div className="relative ">
            <div className="flex items-start gap-4">
              {/* Иконка */}
              <div className="p-3 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-xl">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>

              {/* Текст */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Расширяйте свои возможности!
                </h3>
                <p className="text-white/90 leading-relaxed">
                  Участвуйте в мероприятиях не только своего профиля, но и всей
                  школы, чтобы зарабатывать баллы в свой общий рейтинг и
                  достигать большего
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Список мероприятий */}
        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="group">
              {/* Заголовок мероприятия */}
              <button onClick={() => toggleExpand(event.id)} className="w-full">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/30 transition-colors p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Иконка статуса */}
                      <div
                        className={`p-2 rounded-lg ${
                          event.is_active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        <Target className="w-4 h-4" />
                      </div>

                      {/* Название мероприятия */}
                      <div className="text-left flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {event.title}
                        </h3>
                        {/* <div className="flex items-center gap-3 text-sm text-white/60 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {event.academic_year}
                          </span>
                          {event.date_start && (
                            <span>{formatDate(event.date_start)}</span>
                          )}
                        </div> */}
                      </div>
                    </div>

                    {/* Стрелка */}
                    <div className="ml-4">
                      {expandedId === event.id ? (
                        <ChevronUp className="w-5 h-5 text-white/60" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-white/60" />
                      )}
                    </div>
                  </div>
                  {/* Детали мероприятия */}
                  {expandedId === event.id && (
                    <div className=" rounded-b-xl  p-4">
                      <div className="space-y-3">
                        {/* Описание */}
                        {event.description ? (
                          <div>
                            <p className="text-white/80 text-sm leading-relaxed">
                              {event.description}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-300">Без описания</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Статистика
        {events.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>
                  Активные: {events.filter((e) => e.is_active).length}
                </span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div>Всего: {events.length}</div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default EventsPage;
