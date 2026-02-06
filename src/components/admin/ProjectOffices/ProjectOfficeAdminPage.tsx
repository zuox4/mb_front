import ProjectOfficeDashboard from "@/components/teacher/project-leader/ProjectOfficeDashboard";
import api from "@/services/api/api";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
interface ProjectOffice {
  title: string;
  // добавьте другие поля, если они есть, например:
  id?: string;
  description?: string;
}
const ProjectOfficeAdminPage = () => {
  const { pathname } = useLocation();
  const [data, setData] = useState<ProjectOffice | null>(null);
  const p_office_id = pathname.split("/")[pathname.split("/").length - 1];
  useEffect(() => {
    const loadProjectOfficeData = async () => {
      const project_office = await api.get<ProjectOffice>(
        `/project-office/${p_office_id}`,
      );
      setData(project_office.data);
    };
    loadProjectOfficeData();
  }, []);
  return (
    data && (
      <div>
        <h1 className="text-white font-codec text-2xl mb-6">{data.title}</h1>
        {p_office_id && <ProjectOfficeDashboard p_office_id={p_office_id} />}
      </div>
    )
  );
};
export default ProjectOfficeAdminPage;
