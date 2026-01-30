import { Calendar } from "lucide-react";
import SimpleEventsMenu from "@/components/student/events/EventsMenu";

const EventsPage = () => {
  // const formatDate = (dateString: string | null) => {
  //   if (!dateString) return "";
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("ru-RU", {
  //     day: "numeric",
  //     month: "short",
  //     year: "numeric",
  //   });
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b ">
      <div className="container mx-auto">
        {/* Заголовок */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-400" />
            <h1 className="text-lg font-medium text-white">
              Общешкольные мероприятия
            </h1>
          </div>
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
              </div>
            </div>
            <p className="text-white/90 leading-relaxed">
              Участвуйте в мероприятиях не только своего профиля, но и всей
              школы, чтобы зарабатывать баллы в свой общий рейтинг и достигать
              большего
            </p>
          </div>
        </div>
        <SimpleEventsMenu />
        {/* Список мероприятий */}
      </div>
    </div>
  );
};

export default EventsPage;
