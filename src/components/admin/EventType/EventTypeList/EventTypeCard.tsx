// components/EventTypeCard.tsx
import { MoreHorizontal } from "lucide-react";
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
    <div className="flex justify-between items-center rounded-lg border bg-sch-blue-dark/70 border-gray-200/10 shadow-sm hover:shadow-md transition-shadow">
      {/* Основная информация */}
      <div className="p-3 cursor-pointer" onClick={handleCardClick}>
        <EventTypeHeader
          title={eventType.title}
          description={eventType.description}
        />

        <div className="flex justify-between items-center">
          <EventTypeStats eventType={eventType} />
        </div>
      </div>
      <span className="text-white px-2 cursor-pointer ">
        <MoreHorizontal onClick={handleCardClick} />
      </span>
    </div>
  );
};

export default EventTypeCard;
