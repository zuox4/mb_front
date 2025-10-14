// hooks/useClassTeacherJournal.ts
import privateApi from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import { StudentJournal } from "./types";

export const useClassTeacherJournal = (
  eventId: number | null,
  groupId: number | null
) => {
  return useQuery<StudentJournal[], Error>({
    queryKey: ["class-teacher-journal", eventId, groupId],
    queryFn: async (): Promise<StudentJournal[]> => {
      if (!eventId || !groupId) {
        throw new Error("EventId and GroupId are required");
      }
      const response = await privateApi.get(`/journal/${eventId}/${groupId}`);
      return response.data;
    },
    enabled: !!eventId && !!groupId,
  });
};
