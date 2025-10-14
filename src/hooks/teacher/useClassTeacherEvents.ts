import privateApi from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";

// hooks/teacher/useEventsForClassTeacher.ts
export const useEventsForClassTeacher = () => {
  // Логика получения мероприятий доступных классному руководителю
  return useQuery({
    queryKey: ["class-teacher-events"],
    queryFn: async () => {
      const response = await privateApi.get("/group-leader/events");
      return response.data;
    },
  });
};
