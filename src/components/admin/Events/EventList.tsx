import Loader from "@/components/owner/Loader";
import { useEvents } from "@/hooks/admin/useAdminEvents";
import EventItem from "./EventItem";

const EventList = () => {
  const { isLoading, data } = useEvents();
  if (isLoading) return <Loader />;
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {data?.map((event) => (
        <EventItem title={event.title} id={event.id} />
      ))}
    </div>
  );
};

export default EventList;
