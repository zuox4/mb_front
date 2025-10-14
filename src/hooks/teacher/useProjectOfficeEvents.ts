import privateApi from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";

// hooks/project-office/useProjectOfficeEvents.ts
export const useProjectOfficeEvents = () => {
  return useQuery({
    queryKey: ["project-office-events"],
    queryFn: async () => {
      const response = await privateApi.get("/project-office/events");
      return response.data;
    },
  });
};
