import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { EventsListFilterProps } from "./filtres";
import { ChevronDown, Search, X, Calendar } from "lucide-react";

const EventsListFilter: React.FC<EventsListFilterProps> = ({
  events,
  selectedEventId,
  setEventId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-xs" ref={dropdownRef}>
      <div className="text-sm font-medium text-gray-600 mb-2 text-white">
        Мероприятие
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full
          backdrop-blur-sm backdrop-saturate-150
          px-4 py-3 rounded-xl
          transition-all duration-200
          border border-white/20
          shadow-sm
          flex items-center justify-between
          ${
            selectedEventId
              ? "bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white"
              : "bg-white/30 text-gray-700 hover:bg-white/40"
          }
        `}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white" />
          <span className="text-sm font-medium truncate text-white">
            {selectedEvent ? selectedEvent.title : "Выберите мероприятие"}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2"
          >
            <div className="backdrop-blur-xl backdrop-saturate-150 bg-white/90 rounded-xl shadow-xl border border-white/20 overflow-hidden">
              {/* Поле поиска */}
              <div className="p-3 border-b border-white/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск мероприятия..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white/50 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Список мероприятий */}
              <div className="max-h-60 overflow-y-auto">
                <button
                  key="all"
                  onClick={() => {
                    setEventId(null);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`
                    w-full px-4 py-3 text-left text-sm transition-colors
                    flex items-center justify-between
                    hover:bg-white/60
                    ${
                      !selectedEventId
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Все мероприятия</span>
                  </div>
                  {!selectedEventId && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </button>

                {filteredEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      setEventId(event.id);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`
                      w-full px-4 py-3 text-left text-sm transition-colors
                      flex items-center justify-between border-t border-white/20
                      hover:bg-white/60
                      ${
                        selectedEventId === event.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700"
                      }
                    `}
                  >
                    <span className="truncate">{event.title}</span>
                    {selectedEventId === event.id && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </button>
                ))}

                {filteredEvents.length === 0 && (
                  <div className="px-4 py-3 text-center text-sm text-gray-500">
                    Мероприятия не найдены
                  </div>
                )}
              </div>

              {/* Статистика */}
              <div className="px-4 py-2 border-t border-white/20 bg-white/30">
                <div className="text-xs text-gray-500">
                  Найдено: {filteredEvents.length} из {events.length}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsListFilter;
