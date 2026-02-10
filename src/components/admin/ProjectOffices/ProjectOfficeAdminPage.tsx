import ProjectOfficeDashboard from "@/components/teacher/project-leader/ProjectOfficeDashboard";
import api from "@/services/api/api";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProjectLeader from "./ProjectLeader";

interface ProjectOffice {
  p_office: {
    title: string;
    // добавьте другие поля, если они есть, например:
    id?: string;
    description?: string;
    accessible_classes: [
      {
        name: string;
        id: number;
      },
    ];
  };
  teacher: Teacher;
}

export type Teacher = {
  id: number;
  display_name: string;
  image: string;
  phone: string;
  email: string;
  lastLogin: string;
};
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
        <h1 className="text-white font-codec text-2xl mb-6 w-full overflow-x-auto">
          {data.p_office.title}
        </h1>
        <div className="grid grid-cols-2">
          {p_office_id && <ProjectLeader teacher={data.teacher} />}
          <div>
            Классы
            {data.p_office.accessible_classes.map((group) => group.name)}
          </div>
        </div>

        {p_office_id && <ProjectOfficeDashboard p_office_id={p_office_id} />}
      </div>
    )
  );
};
export default ProjectOfficeAdminPage;
