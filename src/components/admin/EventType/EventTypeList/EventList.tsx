// components/EventList.tsx

interface Event {
  id: string;
  title: string;
}

interface EventListProps {
  events: Event[];
  onAddEvent?: () => void;
}

export const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <>
      <h4 className="text-lg font-medium text-white">
        Мероприятия и статистика
      </h4>

      <div className="flex flex-wrap gap-2">
        {events.length > 0 ? (
          events.map((event) => (
            <span
              key={event.id}
              className="border truncate border-white text-white p-2 rounded-2xl cursor-pointer"
            >
              {event.title}
            </span>
          ))
        ) : (
          <span className="text-gray-400">Нет добавленных мероприятий</span>
        )}
      </div>
    </>
  );
};

export default EventList;
