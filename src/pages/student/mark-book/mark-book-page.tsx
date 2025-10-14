import Loader from "@/components/owner/Loader";
import NotFoundInfo from "@/components/owner/NotFoundInfo";
import BackButton from "@/components/student/markbook/BackButton";
import MarkList from "@/components/student/markbook/MarkList";
import PageHeader from "@/components/student/markbook/PageHeader";
import Statistics from "@/components/student/markbook/Statistics";
import { useMarkBookData } from "@/hooks/student/useMarkBook";
import { useProjectData } from "@/hooks/student/useProjectData";
import { useStudentData } from "@/hooks/student/useStudentData";
import { useState } from "react";

// Главный компонент страницы
function MarkBookPage() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const { data: marks, isLoading } = useMarkBookData();
  const { data: project, isLoading: isProjectLoading } = useProjectData();
  const { data: studentData, isLoading: isLoadingStudentData } =
    useStudentData();
  if (isLoading || isLoadingStudentData || isProjectLoading) return <Loader />;
  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };
  if (!studentData?.project_office_id) return <NotFoundInfo />;
  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <BackButton path="/student" title="К проектному оффису" />
        {studentData && (
          <PageHeader
            projectTitle={project?.title}
            displayName={studentData.display_name}
            groupName={studentData?.class_name}
          />
        )}

        {marks && (
          <>
            <Statistics marks={marks.marks} />
            <MarkList
              marks={marks.marks}
              expandedCard={expandedCard}
              onToggleCard={toggleCard}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default MarkBookPage;
