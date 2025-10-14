import { type Event, useProjectData } from "@/hooks/student/useProjectData";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const ProjectEvents = () => {
  const { data } = useProjectData();

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const eventsToShow =
    data?.accessible_events.filter((event) => event.is_active) || [];

  // На десктопе всегда показываем все мероприятия
  const desktopEvents = eventsToShow;
  // На мобильных показываем 3 или все в зависимости от состояния
  const mobileEvents = isExpanded ? eventsToShow : eventsToShow.slice(0, 3);

  return (
    <div className=" rounded-2xl">
      <h3 className="text-md font-bold text-white mb-4 uppercase border-b-2 border-sch-green-light pb-2 ">
        Мероприятия вашего профиля
      </h3>

      {/* Десктопная версия - всегда все мероприятия */}
      <div className="hidden lg:grid grid-cols-2 gap-2">
        {desktopEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {!desktopEvents.length && <EmptyState />}
      </div>

      {/* Мобильная версия - с ограничением */}
      <div className="lg:hidden space-y-4">
        {mobileEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {!mobileEvents.length && <EmptyState />}
      </div>

      {/* Кнопки управления */}
      <div className="mt-4">
        {/* На мобильных - кнопка раскрытия */}
        {eventsToShow.length > 3 && (
          <button
            onClick={toggleExpanded}
            className="lg:hidden w-full flex items-center justify-center gap-2 bg-sch-green-light hover:bg-sch-green-dark text-white py-2 px-4 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={20} />
                Свернуть
              </>
            ) : (
              <>
                <ChevronDown size={20} />
                Показать все ({eventsToShow.length})
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// Вынесем карточку события в отдельный компонент для чистоты
const EventCard = ({ event }: { event: Event }) => (
  <div className="bg-sch-blue-dark/60 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <h4 className="font-semibold text-white text-sm lg:text-base">
          {event.title}
        </h4>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center text-gray-400 py-4">
    Нет запланированных мероприятий
  </div>
);

export default ProjectEvents;
