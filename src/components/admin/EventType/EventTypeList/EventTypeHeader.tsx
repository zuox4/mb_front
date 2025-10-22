// components/EventTypeHeader.tsx
interface EventTypeHeaderProps {
  title: string;
  description?: string;
}

export const EventTypeHeader: React.FC<EventTypeHeaderProps> = ({ title }) => (
  <h3 className="text-xl font-semibold text-white ">{title}</h3>
);

export default EventTypeHeader;
