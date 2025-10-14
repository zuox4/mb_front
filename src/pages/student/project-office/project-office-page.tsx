import Loader from "@/components/owner/Loader";
import ProjectDashBoard from "@/components/student/project-office/ProjectDashBoard";
import WelcomePage from "@/components/student/project-office/WelcomeForAll";
// import { useAuth } from "@/hooks/auth";
import { useProjectData } from "@/hooks/student/useProjectData";
import { useStudentData } from "@/hooks/student/useStudentData";

const ProjectOfficePage = () => {
  const { isLoading: isLoadingStudentData } = useStudentData();
  const { data, isLoading } = useProjectData();

  if (isLoading || isLoadingStudentData) return <Loader />;
  if (!data) return <WelcomePage />;
  return (
    <div className="text-white">
      <ProjectDashBoard
        title={data?.title}
        description={data?.description}
        logo_url={data?.logo_url}
      />
    </div>
  );
};

export default ProjectOfficePage;
