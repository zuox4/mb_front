// components/project-office/ProjectOfficeDashboard.tsx
import { useProjectOfficeGroups } from "@/hooks/teacher/useProjectOfficeGroups";
import {
  PivotStudent,
  useProjectOfficePivot,
} from "@/hooks/teacher/useProjectOfficePivot";
import React, { useState } from "react";
import ExportButton from "./ExportButton";
import GroupFilter from "./GroupFilter";
import PivotStats from "./PivotStats";
import PivotTableView from "./PivotTableView";
import StudentDetailsModal from "./StudentDetailsModal";

const ProjectOfficeDashboard: React.FC = () => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<PivotStudent | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: groups = [] } = useProjectOfficeGroups();
  const {
    data: pivotData,
    isLoading,
    error,
  } = useProjectOfficePivot(selectedGroups);

  const handleStudentClick = (student: PivotStudent) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

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

  return (
    <div className=" text-white font-codec-news">
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Сводная аналитика - Проектный офис
          </h1>
          <p className="text-gray-400 mt-1">
            Результаты учеников по всем мероприятиям проектного офиса
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-500/20 hidden md:block text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30">
            Руководитель проектного офиса
          </div>
        </div>
      </div>

      {/* Фильтр классов */}
      <GroupFilter
        groups={groups}
        selectedGroups={selectedGroups}
        onGroupsChange={setSelectedGroups}
      />

      {/* Статистика */}
      {pivotData && pivotData.length > 0 && <PivotStats students={pivotData} />}

      {/* Сводная таблица */}
      <div className="mt-8">
        {pivotData && pivotData.length > 0 ? (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex flex-col justify-between items-center md:flex-row mb-4">
              <h2 className="text-xl font-semibold">
                Сводная таблица результатов
              </h2>
              <div className="flex items-center space-x-4">
                <ExportButton students={pivotData} disabled={false} />
              </div>
            </div>

            <PivotTableView
              students={pivotData}
              onStudentClick={handleStudentClick}
            />
          </div>
        ) : selectedGroups.length > 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-4">📊</div>
            <div className="text-lg mb-2">Нет данных для отображения</div>
            <div className="text-sm text-gray-400">
              По выбранным классам нет данных об учениках
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-4">📊</div>
            <div className="text-lg mb-2">
              Выберите классы для просмотра аналитики
            </div>
            <div className="text-sm text-gray-400">
              Будут показаны результаты учеников выбранных классов по всем
              мероприятиям
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно с детальной информацией */}
      <StudentDetailsModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ProjectOfficeDashboard;
