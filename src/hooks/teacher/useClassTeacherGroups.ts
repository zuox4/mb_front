import privateApi from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";

// hooks/teacher/useClassTeacherGroups.ts
export const useClassTeacherGroups = () => {
  // Логика получения классов, за которые отвечает классный руководитель
  return useQuery({
    queryKey: ["class-teacher-groups"],
    queryFn: async () => {
      const response = await privateApi.get("/groups/for_group_leader");
      return response.data;
    },
  });
};
