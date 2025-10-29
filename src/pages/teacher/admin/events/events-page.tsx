import EventList from "@/components/admin/Events/EventList";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
  const navigation = useNavigate();
  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white font-codec text-2xl">Мероприятия</h1>
      </div>
      <div
        onClick={() => navigation("create-event")}
        className="flex w-fit mb-7  items-center gap-2 bg-white/10 backdrop-blur-xs px-4 py-2 rounded-3xl cursor-pointer"
      >
        <span className="text-white ">Добавить новое</span>
        <Plus className="text-white cursor-pointer" />
      </div>
      <EventList />
    </div>
  );
};

export default EventsPage;
