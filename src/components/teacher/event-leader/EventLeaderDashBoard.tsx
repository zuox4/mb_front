import { useEventsForLeaderEvent } from "@/hooks/teacher/useEventLeadeEvents";
import { useAllGroups } from "@/hooks/teacher/useEventLeaderGroups";

import { useEffect, useState } from "react";
import Loader from "../../owner/Loader";
import EventsListFilter from "./EventsListFilter";
import GroupListFilter from "./GroupListFilter";
import JournalData from "./journal/JournalData";

const EventTypeLeaderDashBoard = () => {
  const [eventId, setEventId] = useState<number | null>(null);
  const [groupId, setGroupId] = useState<number | null>(null);

  const { data: groups, isLoading: loadingGroups } = useAllGroups();
  const { data: events, isLoading: loadingEvents } = useEventsForLeaderEvent();

  // Устанавливаем дефолтные значения при загрузке данных
  useEffect(() => {
    if (events && events.length > 0 && !eventId) {
      setEventId(events[0].id);
    }
  }, [events, eventId]);

  useEffect(() => {
    if (groups && groups.length > 0 && !groupId) {
      setGroupId(groups[0].id);
    }
  }, [groups, groupId]);

  if (loadingGroups || loadingEvents) return <Loader />;

  return (
    <div className="text-white font-codec-news">
      <h1 className="text-2xl font-bold mb-6">Журнал мероприятий</h1>

      {/* Фильтры */}

      <div className="space-y-6 mb-6">
        <GroupListFilter
          groups={groups}
          selectedGroupId={groupId}
          setGroupId={setGroupId}
        />
        <EventsListFilter
          events={events}
          selectedEventId={eventId}
          setEventId={setEventId}
        />
      </div>

      {/* Отображение журнала или сообщения об отсутствии данных */}
      <div className="mt-8">
        {eventId && groupId ? (
          <div className="rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Результаты мероприятия
            </h2>
            {/* Здесь будет компонент с данными журнала */}
            <JournalData eventId={eventId} groupId={groupId} />
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Нет данных для отображения
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTypeLeaderDashBoard;
