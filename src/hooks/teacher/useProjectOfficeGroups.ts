import privateApi from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";

// hooks/project-office/useProjectOfficeGroups.ts
export const useProjectOfficeGroups = () => {
  return useQuery({
    queryKey: ["project-office-groups"],
    queryFn: async () => {
      const response = await privateApi.get("/project-office/groups");
      return response.data;
    },
  });
};
