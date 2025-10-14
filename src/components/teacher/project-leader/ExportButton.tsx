// components/project-office/ExportButton.tsx
import { useExcelExport } from "@/hooks/teacher/useExcelExport";
import { PivotStudent } from "@/hooks/teacher/useProjectOfficePivot";
import React from "react";

interface ExportButtonProps {
  students: PivotStudent[];
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  students,
  disabled = false,
}) => {
  const { exportToExcel } = useExcelExport();

  const handleExport = () => {
    exportToExcel({
      students,
      fileName: `project_office_report_${students[0]?.group_name || "all"}`,
    });
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || !students || students.length === 0}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
        ${
          disabled || !students || students.length === 0
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }
      `}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span>Выгрузить в Excel</span>
    </button>
  );
};

export default ExportButton;
