/* eslint-disable @typescript-eslint/no-explicit-any */
import EventList from "@/components/admin/EventType/EventTypeList/EventList";
import StageList from "@/components/admin/EventType/EventTypeList/StageList";
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
          Тип пероприятия - {eventType.title}
        </h1>
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <h4 className="text-lg font-medium mb-4 text-white">Ответственный</h4>
          {
            <div className="bg-white p-4 rounded-lg w-fit">
              {eventType.leader ? (
                <>
                  <h1 className="font-codec">
                    {eventType.leader?.display_name}
                  </h1>
                  <h1>{eventType.leader?.email}</h1>
                </>
              ) : (
                "Не назначен"
              )}
            </div>
          }
        </div>

        <StageList stages={eventType.stages} />
        <EventList events={eventType.events} />
      </div>
    </div>
  );
};

export default EventType;
