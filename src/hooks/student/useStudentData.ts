import api from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth";

interface BaseLeader {
  display_name: string;
  about: string | null;
  image: string | null;
  email: string | null;
  max_url: string | null;
}

interface ApiStudentData {
  display_name: string;
  class_name: string;
  project_office_id: number | null;
  group_leader: BaseLeader | null;
  project_leader: BaseLeader | null;
}

export const useStudentData = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["student"],
    queryFn: async (): Promise<ApiStudentData> => {
      const { data } = await api.get<ApiStudentData>("/student");
      return data;
    },
    enabled: user?.roles?.includes("student"),
    staleTime: 60 * 60 * 1000, // 1 час
  });
};
