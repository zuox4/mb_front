// components/EventTypeCard.tsx
import { MoreHorizontal, Calendar } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { EventType } from "../types/event_type";
import EventTypeHeader from "./EventTypeHeader";
import EventTypeStats from "./EventTypeStats";

interface EventTypeCardProps {
  eventType: EventType;
}

const EventTypeCard: React.FC<EventTypeCardProps> = ({ eventType }) => {
  const navigate = useNavigate();

  const handleCardClick = () =>
    navigate(`${eventType.id}`, { state: { eventType } });

  return (
    <div className="bg-gradient-to-r from-sch-green-light/40 to-sch-green-light/20  rounded-xl  border-gray-200/10 shadow-sm">
      <div className="flex items-start justify-between p-4">
        {/* Основная информация */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg mt-1 text-white">
              <Calendar className="w-4 h-4 text-blue-300" />
            </div>
            <div className="flex-1 min-w-0">
              <EventTypeHeader
                title={eventType.title}
                description={eventType.description}
              />
            </div>
          </div>

          <div className="flex justify-between items-center ">
            <EventTypeStats eventType={eventType} />
          </div>
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
