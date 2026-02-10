// components/project-office/ProjectOfficeDashboard.tsx
import {
  PivotStudent,
  useProjectOfficePivot,
} from "@/hooks/teacher/useProjectOfficePivot";
import React, { useState } from "react";
import ExportButton from "./ExportButton";
import PivotStats from "./PivotStats";
import PivotTableView from "./PivotTableView";
import StudentDetailsModal from "./StudentDetailsModal";
import { BarChart3, Table, PieChart, TrendingUp, Download } from "lucide-react";

const ProjectOfficeDashboard: React.FC<{ p_office_id?: string }> = ({
  p_office_id,
}) => {
  const [selectedGroups] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<PivotStudent | null>(
    null,
  );
  console.log(p_office_id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "table">(
    "analytics",
  );

  const {
    data: pivotData,
    isLoading,
    error,
  } = useProjectOfficePivot(selectedGroups, p_office_id);

  const tabs = [
    {
      id: "analytics",
      label: "Аналитика",
      icon: BarChart3,
      description: "Графики и статистика",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      id: "table",
      label: "Таблица",
      icon: Table,
      description: "Детальные данные",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30",
    },
  ];

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

  const activeTabConfig = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="text-white font-codec-news">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Проектный офис - Панель управления
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Аналитика и управление проектными результатами
          </p>
        </div>
      </div>

      {/* Табы */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative p-4 rounded-xl border transition-all duration-300 group ${
                  isActive
                    ? `${tab.bgColor} ${tab.borderColor} border-2 scale-[1.02] shadow-lg`
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-lg ${isActive ? tab.bgColor : "bg-white/5"}`}
                  >
                    <Icon
                      className={`w-6 h-6 ${isActive ? tab.color : "text-gray-400 group-hover:text-gray-300"}`}
                    />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${isActive ? "text-white" : "text-gray-300 group-hover:text-white"}`}
                      >
                        {tab.label}
                      </span>
                      {isActive && (
                        <div
                          className={`w-2 h-2 rounded-full ${tab.color.replace("text-", "bg-")}`}
                        ></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">
                      {tab.description}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Контент табов */}
      {activeTab === "analytics" ? (
        // Вкладка "Аналитика"
        <div className="space-y-6">
          {/* Статистика */}
          {pivotData && pivotData.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeTabConfig?.bgColor}`}>
                    <PieChart className={`w-5 h-5 ${activeTabConfig?.color}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      Общая статистика
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Ключевые метрики по всем участникам
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <PivotStats students={pivotData} p_office_id={p_office_id} />
            </div>
          )}

          {/* Дополнительная аналитика */}
          {pivotData && pivotData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Карточка с топ участниками */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">
                    Топ рейтинга профиля
                  </h3>
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                </div>
                <div className="space-y-3">
                  {pivotData
                    .sort((a, b) => {
                      const aScore = Object.values(a.events || {}).reduce(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (sum: number, event: any) =>
                          sum + (event.total_score || 0),
                        0,
                      );
                      const bScore = Object.values(b.events || {}).reduce(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (sum: number, event: any) =>
                          sum + (event.total_score || 0),
                        0,
                      );
                      return bScore - aScore;
                    })
                    .slice(0, 5)
                    .map((student, index) => {
                      const score = Object.values(student.events || {}).reduce(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (sum: number, event: any) =>
                          sum + (event.total_score || 0),
                        0,
                      );

                      return (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center bg-blue-500/20 rounded text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="text-sm">
                              {student.student_name}
                            </span>
                          </div>
                          <div className="text-emerald-400 font-bold">
                            {score} баллов
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Карточка с активностью */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">
                    Активность по мероприятиям
                  </h3>
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <div className="h-48 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">График активности</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Вкладка "Таблица"
        <div>
          {pivotData && pivotData.length > 0 ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeTabConfig?.bgColor}`}>
                    <Table className={`w-5 h-5 ${activeTabConfig?.color}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      Детальная таблица результатов
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Поиск, фильтрация и экспорт данных по ученикам
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ExportButton students={pivotData} disabled={false} />
                </div>
              </div>

              <PivotTableView
                students={pivotData}
                onStudentClick={handleStudentClick}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Table className="w-16 h-16 mx-auto opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Нет данных для отображения
              </h3>
              <p className="text-gray-400">
                В проектном офисе пока нет данных об участниках
              </p>
            </div>
          )}
        </div>
      )}

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
