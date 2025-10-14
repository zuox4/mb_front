import { privateApi } from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import { useStudentData } from "./useStudentData";

export interface Event {
  id: number;
  title: string;
  is_active?: boolean;
}
interface ApiProjectOffice {
  title: string;
  description: string;
  logo_url: string;
  accessible_events: [Event];
}
const getProjectData = async (): Promise<ApiProjectOffice> => {
  const res = await privateApi.get<ApiProjectOffice>("/student/project_office");

  return res.data;
};
// # получаем проект
export const useProjectData = () => {
  const { data } = useStudentData();
  return useQuery<ApiProjectOffice>({
    queryKey: ["projectOffice"],
    queryFn: getProjectData,
    staleTime: 10 * 60 * 1000, // 10 минут - данные считаются свежими
    enabled: !!data?.project_office_id,
  });
};
