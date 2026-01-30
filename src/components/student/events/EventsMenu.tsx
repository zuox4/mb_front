import api from "@/services/api/api";
import { useEffect, useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";

interface Event {
  id: number;
  title: string;
}

interface EventType {
  id: number;
  title: string;
  leader?: {
    display_name: string;
  };
  description?: string;
  events: Event[];
}

const SimpleEventsMenu = () => {
  const [eventsTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getEventTypes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/event-types/all_event_types");
      setEventTypes(response.data);
    } catch (error) {
      console.error("Error loading event types:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEventTypes();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b ">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-white/10 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            <div>
              <h1 className="text-xl font-medium text-white">Категории</h1>
              <p className="text-white/60 text-sm">
                {eventsTypes.length} категорий мероприятий
              </p>
            </div>
          </div>
          <div className="h-px bg-white/10" />
        </div>

        {/* Список категорий */}
        <div className="space-y-2">
          {eventsTypes.map((eventType, index) => (
            <div key={eventType.id} className="bg-white/20 rounded-2xl">
              <button
                onClick={() => toggleExpand(eventType.id)}
                className="w-full text-left"
              >
                <div className="p-4 hover:bg-white/5 rounded-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-white/40 text-sm">{index + 1}</div>
                      <div className="text-left">
                        <h3 className="text-white font-medium">
                          {eventType.title}
                        </h3>
                        <div className="text-white/60 text-xs mt-1">
                          {eventType.events?.length || 0} мероприятий
                          {eventType.leader?.display_name && (
                            <>
                              {" "}
                              <br />• Ответственный{" "}
                              {eventType.leader.display_name}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      {expandedId === eventType.id ? (
                        <ChevronUp className="w-5 h-5 text-white/40" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/40" />
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {/* Мероприятия */}
              {expandedId === eventType.id &&
                eventType.events &&
                eventType.events.length > 0 && (
                  <div className="ml-12 mb-2">
                    <div className="space-y-1">
                      {eventType.events.map((event) => (
                        <div
                          key={event.id}
                          className="p-2 text-white/80 text-sm hover:text-white hover:bg-white/5 rounded transition-colors"
                        >
                          • {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleEventsMenu;
