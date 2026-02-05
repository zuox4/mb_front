// components/class-teacher/ClassTeacherDashboard.tsx
import { StageInfo } from "@/hooks/teacher/journal/types";
import { useClassTeacherJournal } from "@/hooks/teacher/journal/useClassTeacherJournal";
import { useEventsForClassTeacher } from "@/hooks/teacher/useClassTeacherEvents";
import { useClassTeacherGroups } from "@/hooks/teacher/useClassTeacherGroups";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import EventsListFilter from "../event-leader/EventsListFilter";
import GroupListFilter from "../event-leader/GroupListFilter";
import EventStats from "./EventStats";
import ReadOnlyStudentRow from "./ReadOnlyStudentRow";
import { AlertCircle } from "lucide-react";

const ClassTeacherDashboard = () => {
  const [eventId, setEventId] = React.useState<number | null>(null);
  const [groupId, setGroupId] = React.useState<number | null>(null);

  const { data: events = [] } = useEventsForClassTeacher();
  const { data: groups = [] } = useClassTeacherGroups();

  const {
    data: journalData,
    isLoading,
    error,
  } = useClassTeacherJournal(eventId, groupId);

  // Установка дефолтных значений при загрузке данных
  useEffect(() => {
    if (groups.length > 0 && !groupId) {
      setGroupId(groups[0].id);
    }
  }, [groups, groupId]);

  useEffect(() => {
    if (events.length > 0 && !eventId) {
      setEventId(events[0].id);
    }
  }, [events, eventId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        Ошибка загрузки данных: {error.message}
      </div>
    );
  }

  // Проверка наличия данных
  const hasGroups = groups.length > 0;
  const hasEvents = events.length > 0;
  const hasSelectedData =
    eventId && groupId && journalData && journalData.length > 0;

  // Если нет классов или мероприятий
  if (!hasGroups || !hasEvents) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl mx-auto"
      >
        <div className="glass-effect rounded-xl p-8 text-center border border-white/20">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-3">
            {!hasGroups && !hasEvents
              ? "Нет доступных данных"
              : !hasGroups
                ? "Нет доступных классов"
                : "Нет доступных мероприятий"}
          </h2>

          <div className="text-white/70 mb-6">
            {!hasGroups && !hasEvents
              ? "Для вашего аккаунта не найдено классов и мероприятий. Обратитесь к администратору."
              : !hasGroups
                ? "Вам не назначены классы в качестве классного руководителя."
                : "Для ваших классов нет доступных мероприятий. Проверьте позже."}
          </div>

          <div className="space-y-3">
            {!hasGroups && (
              <div className="bg-white/5 rounded-lg p-4 text-left">
                <h3 className="font-medium text-white mb-2">Что делать?</h3>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• Обратитесь к администратору для назначения классов</li>
                  <li>• Проверьте настройки вашего профиля</li>
                  <li>
                    • Убедитесь, что у вас есть права классного руководителя
                  </li>
                </ul>
              </div>
            )}

            {!hasEvents && hasGroups && (
              <div className="bg-white/5 rounded-lg p-4 text-left">
                <h3 className="font-medium text-white mb-2">Что делать?</h3>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>
                    • Проверьте, есть ли активные мероприятия для ваших классов
                  </li>
                  <li>• Обратитесь к организаторам мероприятий</li>
                  <li>• Проверьте расписание мероприятий</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Получаем все уникальные стадии из данных
  const allStages =
    journalData?.reduce((stages: StageInfo[], student) => {
      student.stages?.forEach((stage) => {
        if (!stages.find((s) => s.name === stage.name)) {
          stages.push({
            name: stage.name,
            stage_id: stage.stage_id,
            min_required_score: stage.min_required_score,
          });
        }
      });
      return stages;
    }, []) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="text-white">
        <h1 className="text-2xl font-bold mb-2">Журнал мероприятий</h1>
        <p className="text-white/60 mb-6">Классный руководитель</p>

        {/* Информация о выбранных фильтрах */}
        {(eventId || groupId) && (
          <div className="flex items-center gap-3 mb-4 text-sm">
            {groupId && (
              <div className="bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg">
                Класс:{" "}
                {groups.find((g: { id: number }) => g.id === groupId)?.name}
              </div>
            )}
            {eventId && (
              <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg">
                Мероприятие:{" "}
                {events.find((e: { id: number }) => e.id === eventId)?.title}
              </div>
            )}
          </div>
        )}

        {/* Фильтры */}
        <div className="flex flex-wrap gap-3 mb-6">
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

        {/* Статистика мероприятия */}
        {hasSelectedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-6"
          >
            <EventStats journalData={journalData} />
          </motion.div>
        )}

        {/* Таблица с результатами */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {hasSelectedData ? (
            <div className="overflow-x-auto border border-white/20 rounded-lg">
              <div className="min-w-full">
                <div className="bg-white/5 border-b border-white/10">
                  <div className="flex">
                    <div className="px-4 py-3 text-left text-sm font-medium text-white min-w-[200px] sticky left-0 bg-white/5 z-10 border-r border-white/10">
                      Ученик
                    </div>
                    {allStages.map((stage) => (
                      <div
                        key={stage.name}
                        className="px-4 py-3 text-center text-sm font-medium text-white min-w-[180px] border-r border-white/10"
                      >
                        <div className="truncate">{stage.name}</div>
                        <div className="text-xs text-white/60 font-normal mt-1">
                          мин. {stage.min_required_score} баллов
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  {journalData.map((student, studentIndex) => (
                    <ReadOnlyStudentRow
                      key={student.id}
                      student={student}
                      studentIndex={studentIndex}
                      allStages={allStages}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="glass-effect rounded-xl p-8 max-w-md mx-auto border border-white/20">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {eventId && groupId
                    ? "Нет данных для отображения"
                    : "Выберите класс и мероприятие"}
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  {eventId && groupId
                    ? "Для выбранных фильтров нет данных о результатах учащихся."
                    : "Для просмотра результатов выберите класс и мероприятие из списков выше."}
                </p>
                {eventId && groupId && (
                  <div className="bg-white/5 rounded-lg p-3 text-sm text-white/70">
                    Проверьте, проводилось ли выбранное мероприятие для этого
                    класса.
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ClassTeacherDashboard;
