// components/EventTypesList.tsx
import React from "react";
import { EventType } from "../types/event_type";
import EventTypeCard from "./EventTypeCard";

interface EventTypesListProps {
  eventTypes: EventType[];
  loading?: boolean;
}

const EventTypesList: React.FC<EventTypesListProps> = ({
  eventTypes,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (eventTypes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg">Типы мероприятий не найдены</div>
        <p className="text-gray-400 mt-2">Создайте первый тип мероприятия</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {eventTypes.map((eventType) => (
        <EventTypeCard key={eventType.id} eventType={eventType} />
      ))}
    </div>
  );
};

export default EventTypesList;
