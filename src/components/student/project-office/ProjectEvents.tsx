import { type Event, useProjectData } from "@/hooks/student/useProjectData";
import { ChevronDown, ChevronUp, Info, Calendar } from "lucide-react";
import { useState } from "react";

type TabType = "all" | "important" | "regular";

const ProjectEvents = () => {
  const { data } = useProjectData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const eventsToShow =
    data?.accessible_events.filter((event) => event.is_active) || [];

  // Разделяем мероприятия на важные и обычные
  const importantEvents = eventsToShow.filter((event) => event.is_important);
  const regularEvents = eventsToShow.filter((event) => !event.is_important);

  // Фильтруем мероприятия в зависимости от выбранной вкладки
  const getFilteredEvents = () => {
    switch (activeTab) {
      case "important":
        return importantEvents;
      case "regular":
        return regularEvents;
      case "all":
      default:
        return eventsToShow;
    }
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-bold text-white uppercase border-b-2 border-sch-green-light pb-2">
          Мероприятия вашего профиля
        </h3>
        <div className="relative group/info">
          <Info className="w-5 h-5 text-gray-400 cursor-help hover:text-white transition-colors" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/info:block w-72 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
            <p className="text-sm text-white">
              <span className="text-red-400 font-semibold">
                Важные мероприятия
              </span>{" "}
              влияют на получение сертификата и обязательны для посещения.
            </p>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Вкладки для фильтрации */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "all"
                ? "bg-white/10 text-white shadow-md"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            {/* <Calendar className="w-4 h-4" /> */}
            Все
            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
              {eventsToShow.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("important")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "important"
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            {/* <Star className="w-4 h-4" /> */}
            Важные
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "important" ? "bg-red-700 text-white" : "bg-gray-700 text-gray-300"}`}
            >
              {importantEvents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("regular")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "regular"
                ? "bg-green-600 text-white shadow-md"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            {/* <Calendar className="w-4 h-4" /> */}
            Рекомендуемые
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "regular" ? "bg-green-700 text-white" : "bg-gray-700 text-gray-300"}`}
            >
              {regularEvents.length}
            </span>
          </button>
        </div>

        {/* Статус текущей вкладки */}
        <div className="mt-3">
          {activeTab === "all" && importantEvents.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>
                <span className="text-red-400 font-medium">
                  {importantEvents.length}
                </span>{" "}
                важных мероприятия влияют на сертификат
              </span>
            </div>
          )}
          {activeTab === "important" && (
            <div className="flex items-center gap-2 text-sm text-red-300">
              <Info className="w-4 h-4" />
              <span>Эти мероприятия обязательны для получения сертификата</span>
            </div>
          )}
          {activeTab === "regular" && (
            <div className="flex items-center gap-2 text-sm text-green-300">
              <Info className="w-4 h-4" />
              <span>Рекомендуемые мероприятия для участия</span>
            </div>
          )}
        </div>
      </div>

      {/* Десктопная версия */}
      <div className="hidden lg:block">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState tab={activeTab} />
        )}
      </div>

      {/* Мобильная версия */}
      <div className="lg:hidden">
        {filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {(isExpanded ? filteredEvents : filteredEvents.slice(0, 3)).map(
              (event) => (
                <EventCard key={event.id} event={event} />
              ),
            )}
          </div>
        ) : (
          <EmptyState tab={activeTab} />
        )}
      </div>

      {/* Кнопки управления на мобильных */}
      {filteredEvents.length > 3 && (
        <button
          onClick={toggleExpanded}
          className="lg:hidden mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sch-green-light to-green-600 hover:from-green-600 hover:to-sch-green-dark text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-900/50"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={20} />
              Свернуть мероприятия
            </>
          ) : (
            <>
              <ChevronDown size={20} />
              Показать все ({filteredEvents.length})
            </>
          )}
        </button>
      )}
    </div>
  );
};

// Вынесем карточку события в отдельный компонент для чистоты
const EventCard = ({ event }: { event: Event }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="group relative bg-sch-blue-dark/40 rounded-xl p-2 hover:bg-sch-blue-dark/60 transition-all duration-300 border border-transparent hover:border-blue-500/30">
      <div className="flex items-start gap-4">
        {/* Индикатор важности с иконкой
        <div
          className={`flex-shrink-0 p-2 rounded-full ${
            event.is_important
              ? "bg-gradient-to-br from-red-600/20 to-rose-700/20 border border-red-500/30"
              : "bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30"
          }`}
        >
          {event.is_important ? (
            <Star className="w-5 h-5 text-red-400" fill="currentColor" />
          ) : (
            <Calendar className="w-5 h-5 text-blue-400" />
          )}
        </div> */}

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-white text-md pr-2">
              {event.title}
            </h4>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-help transition-all ${
                  event.is_important
                    ? "bg-gradient-to-r from-red-900/40 to-rose-900/30 text-red-300 border border-red-700/50 hover:border-red-500"
                    : "bg-gradient-to-r from-blue-900/30 to-cyan-900/20 text-blue-300 border border-blue-700/50 hover:border-blue-500"
                }`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <div
                  className={`w-2 h-2 rounded-full ${event.is_important ? "bg-red-400 animate-pulse" : "bg-blue-400"}`}
                ></div>
                {event.is_important ? "Влияет на сертификат" : "Рекомендуемое"}

                {/* Подсказка */}
                {showTooltip && (
                  <div
                    className={`absolute ${event.is_important ? "left-1 -translate-x-1" : "left-0"} bottom-full mb-2 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50`}
                  >
                    <p className="text-sm text-white">
                      {event.is_important
                        ? "Это обязательное мероприятие влияет на получение сертификата"
                        : "Участие в этом мероприятии рекомендуется для развития"}
                    </p>
                    <div
                      className={`absolute -bottom-1 ${event.is_important ? "left-1/2 -translate-x-1/2" : "left-4"} w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45`}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ tab }: { tab: TabType }) => {
  const getEmptyMessage = () => {
    switch (tab) {
      case "important":
        return {
          title: "Нет важных мероприятий",
          description: "На данный момент у вас нет обязательных мероприятий",
          icon: "🎉",
        };
      case "regular":
        return {
          title: "Нет запланированных мероприятий",
          description: "Рекомендуемые мероприятия появятся позже",
          icon: "📅",
        };
      case "all":
      default:
        return {
          title: "Нет мероприятий",
          description: "На данный момент мероприятия не запланированы",
          icon: "📭",
        };
    }
  };

  const message = getEmptyMessage();

  return (
    <div className="text-center py-10 px-4">
      <div className="text-5xl mb-4">{message.icon}</div>
      <h4 className="text-xl font-semibold text-white mb-2">{message.title}</h4>
      <p className="text-gray-400 mb-6">{message.description}</p>

      {tab !== "all" && (
        <button
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("changetab", { detail: "all" }),
            )
          }
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Посмотреть все мероприятия
        </button>
      )}
    </div>
  );
};

export default ProjectEvents;
