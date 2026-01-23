/* eslint-disable @typescript-eslint/no-explicit-any */
import EventList from "@/components/admin/EventType/EventTypeList/EventList";
import StageList from "@/components/admin/EventType/EventTypeList/StageList";
import Boss from "@/components/admin/EventType/LeaderView";
import BackButton from "@/components/student/markbook/BackButton";
import { useLocation } from "react-router-dom";

const EventType = () => {
  const location = useLocation();
  const { eventType } = location.state;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <BackButton path="/teacher/admin/event-types" title="Назад" />

        <h1 className="text-center flex-2  font-codec text-2xl text-white top-0">
          Тип мероприятия - {eventType.title}
        </h1>
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <h4 className="text-lg font-medium mb-4 text-white">Ответственный</h4>
          <Boss leader={eventType.leader} />
        </div>

        <StageList stages={eventType.stages} />
        <EventList events={eventType.events} />
      </div>
    </div>
  );
};

export default EventType;
