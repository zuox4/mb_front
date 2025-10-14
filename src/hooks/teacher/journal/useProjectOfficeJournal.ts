// hooks/useProjectOfficeJournal.ts
import privateApi from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import { StudentJournal } from "./types";

export interface ProjectOfficeJournal extends StudentJournal {
  group_name?: string;
  class_teacher?: string;
}

export const useProjectOfficeJournal = (eventId: number | null) => {
  return useQuery<ProjectOfficeJournal[], Error>({
    queryKey: ["project-office-journal", eventId],
    queryFn: async (): Promise<ProjectOfficeJournal[]> => {
      if (!eventId) {
        throw new Error("EventId is required");
      }
      const response = await privateApi.get(
        `/project-office/journal/${eventId}`
      );
      return response.data;
    },
    enabled: !!eventId,
  });
};
