import NewProjectLeaderDashboard from "@/components/teacher/new-project-leader/ProjectLeaderDashboard";
import ProjectOfficeDashboard from "@/components/teacher/project-leader/ProjectOfficeDashboard";
import { ChangeEvent, useState } from "react";

type DashboardView = "full" | "small";

const ProjectLeaderPage = () => {
  const [view, setView] = useState<DashboardView>("full");

  const handleViewChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setView(event.target.value as DashboardView);
  };

  const viewOptions = [
    { value: "full" as const, label: "📊 Подробная версия" },
    { value: "small" as const, label: "⚡ Упрощенный режим" },
  ];

  return (
    <div className="flex flex-col space-y-4">
      {/* Селектор режима просмотра */}
      <div className="flex items-center space-x-3">
        <select
          id="view-selector"
          value={view}
          onChange={handleViewChange}
          className="px-3 py-1 text-white border border-sch-green-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        >
          {viewOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-black"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Контент дашборда */}
      <div className="transition-all duration-300 ease-in-out">
        {view === "full" ? (
          <ProjectOfficeDashboard />
        ) : (
          <NewProjectLeaderDashboard />
        )}
      </div>
    </div>
  );
};

export default ProjectLeaderPage;
