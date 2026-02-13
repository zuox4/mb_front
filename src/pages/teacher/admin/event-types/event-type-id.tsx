/* eslint-disable @typescript-eslint/no-explicit-any */
import EventList from "@/components/admin/EventType/EventTypeList/EventList";
import StageList from "@/components/admin/EventType/EventTypeList/StageList";
import Boss from "@/components/admin/EventType/LeaderView";
import BackButton from "@/components/student/markbook/BackButton";

import { useLocation } from "react-router-dom";

interface Leader {
  id: number;
  display_name: string;
  email: string;
  roles?: string[];
}

interface EventTypeData {
  id: number;
  title: string;
  leader: Leader | null;
  stages: any[];
  events: any[];
}

const EventType = () => {
  const location = useLocation();
  const { eventType } = location.state as { eventType: EventTypeData };

  return (
    <div className="flex flex-col p-6">
      <div className="flex flex-row items-center mb-6">
        <BackButton path="/teacher/admin/event-types" title="Назад" />
        <h1 className="text-center flex-1 font-codec text-2xl text-white">
          Тип мероприятия - {eventType.title}
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-lg p-4">
          <h4 className="text-lg font-medium mb-4 text-gray-800">
            Ответственный
          </h4>
          <Boss eventTypeId={eventType.id} />
        </div>

        <StageList stages={eventType.stages} />
        <EventList events={eventType.events} />
      </div>
    </div>
  );
};

export default EventType;
