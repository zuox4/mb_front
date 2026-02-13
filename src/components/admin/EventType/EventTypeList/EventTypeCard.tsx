// components/EventTypeCard.tsx
import { Calendar } from "lucide-react";
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
    <div
      onClick={handleCardClick}
      className="cursor-pointer group relative bg-gradient-to-r from-sch-green-light/40 to-sch-green-light/20 hover:from-sch-green-light/50 hover:to-sch-green-light/30 hover:shadow-lg transition-all duration-300 rounded-xl p-4 border border-sch-green-light/30"
    >
      <div className="flex items-start justify-between">
        {/* Основная информация */}
        <div className="flex-1 min-w-0 cursor-pointer items-center">
          <div className="flex items gap-3">
            <div className="py-1  rounded-lg text-white">
              <Calendar className="w-4 h-4 text-white" />
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
      </div>
    </div>
  );
};

export default EventTypeCard;
