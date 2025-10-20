// components/EventList.tsx

interface Event {
  id: string;
  title: string;
}

interface EventListProps {
  events: Event[];
  onAddEvent?: () => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onAddEvent }) => {
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
        {/* <span
          className="text-white p-2 rounded-2xl flex gap-2 cursor-pointer bg-sch-green-light"
          onClick={onAddEvent}
        >
          Добавить <Plus size={18} />
        </span> */}
      </div>
    </>
  );
};

export default EventList;
