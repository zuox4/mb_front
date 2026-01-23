// components/EventTypeHeader.tsx
interface EventTypeHeaderProps {
  title: string;
  description?: string;
}

export const EventTypeHeader: React.FC<EventTypeHeaderProps> = ({ title }) => (
  <div className="min-w-0">
    <h3 className="text-[16px] font-semibold text-white truncate">{title}</h3>
  </div>
);

export default EventTypeHeader;
