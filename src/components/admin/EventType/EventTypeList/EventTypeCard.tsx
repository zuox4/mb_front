// components/EventTypeCard.tsx
import { Calendar, MoreHorizontal } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { EventType } from "../types/event_type";
import EventTypeHeader from "./EventTypeHeader";

interface EventTypeCardProps {
  eventType: EventType;
}

const EventTypeCard: React.FC<EventTypeCardProps> = ({ eventType }) => {
  const navigate = useNavigate();

  const handleCardClick = () =>
    navigate(`${eventType.id}`, { state: { eventType } });

  return (
    <div className="group relative w-100 bg-gradient-to-r from-sch-green-light/40 to-sch-green-light/20 hover:from-sch-green-light/50 hover:to-sch-green-light/30 hover:shadow-lg transition-all duration-300 rounded-xl p-4 border border-sch-green-light/30">
      <div className="flex items-start justify-between">
        {/* Основная информация */}
        <div
          className="flex-1 min-w-0 cursor-pointer items-center"
          onClick={handleCardClick}
        >
          <div className="flex items gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-white">
              <Calendar className="w-4 h-4 text-blue-300" />
            </div>

            <EventTypeHeader
              title={eventType.title}
              description={eventType.description}
            />
          </div>

          {/* <div className="flex justify-between items-center ">
            <EventTypeStats eventType={eventType} />
          </div> */}
        </div>

        {/* Кнопка подробнее */}
        <button
          onClick={handleCardClick}
          className="ml-3 p-2 rounded-lg bg-gray-200/10 text-gray-300"
          title="Подробнее"
        >
          <MoreHorizontal className="w-5 h-5  text-white cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default EventTypeCard;
