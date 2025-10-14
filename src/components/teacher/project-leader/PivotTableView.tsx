import { PivotStudent } from "@/hooks/teacher/useProjectOfficePivot";
import React from "react";

interface PivotTableViewProps {
  students: PivotStudent[];
  onStudentClick: (student: PivotStudent) => void;
}

const PivotTableView: React.FC<PivotTableViewProps> = ({
  students,
  onStudentClick,
}) => {
  if (!students || students.length === 0) return null;

  // Получаем все мероприятия из данных
  const allEvents = Object.keys(students[0]?.events || {});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getEventStatus = (event: any) => {
    if (event.completed_stages_count >= event.min_stages_required) {
      return { status: "зачет", color: "bg-green-500 text-white" };
    } else if (event.total_score > 0) {
      return { status: "в процессе", color: "bg-yellow-500 text-black" };
    } else {
      return { status: "не начато", color: "bg-gray-500 text-white" };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-4 py-3 text-left text-sm font-medium text-white border-r border-gray-600 sticky left-0 bg-gray-700 z-20">
              Класс
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-white border-r border-gray-600 sticky left-0 bg-gray-700 z-20 min-w-[200px]">
              Ученик
            </th>
            {allEvents.map((eventId) => {
              const event = students[0]?.events[eventId];
              return (
                <th
                  key={eventId}
                  className="px-3 py-3 text-center text-sm font-medium text-white border-r border-gray-600 min-w-[180px]"
                >
                  <div className="font-medium">{event?.event_name}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {students.map((student, studentIndex) => (
            <tr
              key={student.id}
              className={`
                ${studentIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} 
                hover:bg-gray-700 cursor-pointer transition-colors
              `}
              onClick={() => onStudentClick(student)}
            >
              {/* Класс */}
              <td className="px-4 py-3 text-sm text-blue-300 border-r border-gray-700 sticky left-0 bg-inherit z-10 font-medium">
                {student.group_name}
              </td>

              {/* Ученик */}
              <td className="px-4 py-3 text-sm text-white border-r border-gray-700 sticky left-0 bg-inherit z-10 min-w-[200px]">
                <div className="font-medium">{student.student_name}</div>
                {student.class_teacher && (
                  <div className="text-xs text-gray-400 mt-1">
                    {student.class_teacher}
                  </div>
                )}
              </td>

              {/* Результаты по мероприятиям */}
              {allEvents.map((eventId) => {
                const event = student.events[eventId];
                if (!event) {
                  return (
                    <td
                      key={eventId}
                      className="px-3 py-3 text-center border-r border-gray-700"
                    >
                      <div className="text-gray-500 text-sm">—</div>
                    </td>
                  );
                }

                const statusInfo = getEventStatus(event);

                return (
                  <td
                    key={eventId}
                    className="px-3 py-3 text-center border-r border-gray-700"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      {/* Статус */}
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}
                      >
                        {statusInfo.status}
                      </div>

                      {/* Прогресс стадий */}
                      <div className="text-xs text-gray-400">
                        {event.completed_stages_count}/
                        {event.min_stages_required}
                      </div>

                      {/* Детали по стадиям (при наведении) */}
                      <div className="hidden group-hover:block absolute mt-8 bg-gray-900 border border-gray-600 rounded p-2 z-30">
                        <div className="text-xs text-white mb-1">Стадии:</div>
                        {event.stages.map((stage, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-gray-300">{stage.name}:</span>
                            <span
                              className={
                                stage.status === "зачет"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              {stage.current_score}б
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PivotTableView;
