import React from "react";
import { EventsListFilterProps } from "./filtres";

const EventsListFilter: React.FC<EventsListFilterProps> = ({
  events,
  selectedEventId,
  setEventId,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Выберите мероприятие</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => setEventId(event.id)}
            className={`
              cursor-pointer border-1 rounded-lg p-1 transition-all
              ${
                selectedEventId === event.id
                  ? "border-sch-green-light bg-sch-green-light bg-opacity-10 text-sch-green-dark"
                  : "border-sch-green-light  hover:bg-sch-blue-dark/50 hover:scale-103"
              }
            `}
          >
            <div className="font-medium text-center">{event.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsListFilter;
