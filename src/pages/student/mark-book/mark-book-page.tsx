import Loader from "@/components/owner/Loader";
import NotFoundInfo from "@/components/owner/NotFoundInfo";

import MarkList from "@/components/student/markbook/MarkList";
import PageHeader from "@/components/student/markbook/PageHeader";
import Statistics from "@/components/student/markbook/Statistics";
import { EventMark, useMarkBookData } from "@/hooks/student/useMarkBook";
import { useProjectData } from "@/hooks/student/useProjectData";
import { useStudentData } from "@/hooks/student/useStudentData";
import { useState, useMemo } from "react";
import { Star, TrendingUp, ListTodo } from "lucide-react";

// Главный компонент страницы
function MarkBookPage() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<
    "important" | "recommended" | "all"
  >("important");

  const { data: marks, isLoading } = useMarkBookData();
  const { data: project, isLoading: isProjectLoading } = useProjectData();
  const { data: studentData, isLoading: isLoadingStudentData } =
    useStudentData();

  // Используем useMemo для оптимизации вычислений
  const { importantMarks, recommendedMarks } = useMemo(() => {
    if (!marks?.marks || !project?.accessible_events) {
      return { importantMarks: [], recommendedMarks: [] };
    }

    // Собираем все важные мероприятия
    const importantEvents = project.accessible_events.filter(
      (event) => event.is_important,
    );

    // Создаем Set важных названий мероприятий (в нижнем регистре)
    const importantEventNames = new Set(
      importantEvents
        .map((event) => event.title?.toLowerCase())
        .filter(Boolean),
    );

    // Создаем Set важных id мероприятий
    const importantEventIds = new Set(importantEvents.map((event) => event.id));

    // Разделяем отметки
    const importantMarks: EventMark[] = [];
    const recommendedMarks: EventMark[] = [];

    marks.marks.forEach((mark: EventMark) => {
      const isImportant =
        importantEventIds.has(mark.id) ||
        (mark.eventName &&
          importantEventNames.has(mark.eventName.toLowerCase()));

      if (isImportant) {
        importantMarks.push(mark);
      } else {
        recommendedMarks.push(mark);
      }
    });

    return { importantMarks, recommendedMarks };
  }, [marks, project]);

  if (isLoading || isLoadingStudentData || isProjectLoading) return <Loader />;

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  if (!studentData?.project_office_id) return <NotFoundInfo />;

  // Контент для каждого таба
  const renderTabContent = () => {
    switch (activeTab) {
      case "important":
        return (
          <>
            <Statistics marks={importantMarks} />
            {importantMarks.length > 0 ? (
              <MarkList
                marks={importantMarks}
                expandedCard={expandedCard}
                onToggleCard={toggleCard}
              />
            ) : (
              <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
                  <Star className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Нет важных мероприятий
                </h3>
                <p className="text-white/60 max-w-md mx-auto">
                  Отметки появятся здесь, когда преподаватель добавит важные
                  мероприятия
                </p>
              </div>
            )}
          </>
        );

      case "recommended":
        return (
          <>
            <Statistics marks={recommendedMarks} />
            {recommendedMarks.length > 0 ? (
              <MarkList
                marks={recommendedMarks}
                expandedCard={expandedCard}
                onToggleCard={toggleCard}
              />
            ) : (
              <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Нет рекомендуемых мероприятий
                </h3>
                <p className="text-white/60 max-w-md mx-auto">
                  Все ваши мероприятия отмечены как важные
                </p>
              </div>
            )}
          </>
        );

      case "all":
        return (
          <>
            <Statistics marks={marks?.marks || []} />
            {marks && marks.marks.length > 0 ? (
              <MarkList
                marks={marks.marks}
                expandedCard={expandedCard}
                onToggleCard={toggleCard}
              />
            ) : (
              <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-500/20 mb-4">
                  <ListTodo className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Нет мероприятий
                </h3>
                <p className="text-white/60 max-w-md mx-auto">
                  Здесь будут отображаться все мероприятия проекта
                </p>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen w-full ">
      <div className="flex flex-col">
        {/* <BackButton path="/student" title="К проектному оффису" /> */}

        {studentData && (
          <PageHeader
            projectTitle={project?.title}
            displayName={studentData.display_name}
            groupName={studentData?.class_name}
          />
        )}

        {marks && (
          <div className="md:px-6">
            {/* Табы в виде горизонтальной панели */}
            <div className="relative mb-8">
              <div className="absolute  bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 blur-xl opacity-30" />

              <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                <div className="flex rounded-lg overflow-hidden">
                  <button
                    onClick={() => setActiveTab("important")}
                    className={`flex-1 flex items-center justify-center text-sm gap-2 py-2 px-2 transition-all duration-300 relative ${
                      activeTab === "important"
                        ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {/* <Star className="w-4 h-4" /> */}
                    <span className="font-medium ">Обязательные</span>
                    {activeTab === "important" && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 rounded-t-full" />
                    )}
                    <span
                      className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === "important"
                          ? "bg-blue-500/40 text-blue-100"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {importantMarks.length}
                    </span>
                  </button>

                  <div className="w-px bg-white/10" />

                  <button
                    onClick={() => setActiveTab("recommended")}
                    className={`flex-1 flex items-center justify-center text-sm gap-2 py-2 px-2 transition-all duration-300 relative ${
                      activeTab === "recommended"
                        ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">Рекомендуемые</span>
                    {activeTab === "recommended" && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-green-400 to-green-300 rounded-t-full" />
                    )}
                    <span
                      className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === "recommended"
                          ? "bg-green-500/40 text-green-100"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {recommendedMarks.length}
                    </span>
                  </button>

                  <div className="w-px bg-white/10" />
                </div>
              </div>
            </div>

            {/* Контент таба */}
            <div className="space-y-6">{renderTabContent()}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarkBookPage;
