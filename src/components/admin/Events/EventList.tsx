import Loader from "@/components/owner/Loader";
import { useEvents } from "@/hooks/admin/useAdminEvents";
import EventItem from "./EventItem";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

const EventList = () => {
  const { isLoading, data } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");

  // Фильтрация событий по названию
  const filteredEvents = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data;

    return data.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (isLoading) return <Loader />;

  return (
    <div className="mb-6">
      {/* Поле поиска */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск по названию события..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sch-green-light focus:border-transparent"
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
            Найдено событий: {filteredEvents.length}
          </p>
        )}
      </div>

      {/* Список событий */}
      {filteredEvents.length === 0 ? (
        <div className="text-center  text-gray-400">
          {searchTerm ? "События не найдены" : "Событий пока нет"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredEvents.map((event) => (
            <EventItem key={event.id} title={event.title} id={event.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
