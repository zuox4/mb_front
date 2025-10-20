// components/EventTypeHeader.tsx
interface EventTypeHeaderProps {
  title: string;
  description?: string;
}

export const EventTypeHeader: React.FC<EventTypeHeaderProps> = ({ title }) => (
  <div className="mb-3">
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
  </div>
);

export default EventTypeHeader;
