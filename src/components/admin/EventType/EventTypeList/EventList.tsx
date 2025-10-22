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
      <h4 className="text-lg font-medium mb-4 text-white">Мероприятия</h4>

      <div className="flex flex-wrap gap-2">
        {events.map((event) => (
          <span
            key={event.id}
            className="border border-white text-white p-2 rounded-2xl"
          >
            {event.title}
          </span>
        ))}
      </div>
    </>
  );
};

export default EventList;
