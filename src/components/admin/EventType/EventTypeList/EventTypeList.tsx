import React, { useState, useMemo } from "react";
import { EventType } from "../types/event_type";
import EventTypeCard from "./EventTypeCard";
import { Search } from "lucide-react";

interface EventTypesListProps {
  eventTypes: EventType[];
  loading?: boolean;
}

const EventTypesList: React.FC<EventTypesListProps> = ({
  eventTypes,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Фильтрация типов событий по названию
  const filteredEventTypes = useMemo(() => {
    if (!eventTypes || eventTypes.length === 0) return [];
    if (!searchTerm.trim()) return eventTypes;

    return eventTypes.filter((eventType) =>
      eventType.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [eventTypes, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Поле поиска */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск по названию типа..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-400">
            Найдено типов: {filteredEventTypes.length} из {eventTypes.length}
          </p>
        )}
      </div>

      {/* Список типов событий */}
      {filteredEventTypes.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          {searchTerm
            ? "Типы мероприятий не найдены"
            : "Типы мероприятий не найдены"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredEventTypes.map((eventType) => (
            <EventTypeCard key={eventType.id} eventType={eventType} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventTypesList;
