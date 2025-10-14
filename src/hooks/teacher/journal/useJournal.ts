import privateApi from "@/services/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StudentJournal, UpdateResultVariables } from "./types";

export const useJournalData = (
  eventId: number | null,
  groupId: number | null
) => {
  return useQuery<StudentJournal[], Error>({
    queryKey: ["journal", eventId, groupId],
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

export type UpdateResultMutation = ReturnType<typeof useUpdateResult>;

export const useUpdateResult = () => {
  const queryClient = useQueryClient();

  return useMutation<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    Error,
    UpdateResultVariables,
    {
      previousJournal: StudentJournal[] | undefined;
      variables: UpdateResultVariables;
    }
  >({
    mutationFn: async (variables: UpdateResultVariables) => {
      const { eventId, studentId, stageId, resultId } = variables;

      if (resultId === null) {
        const response = await privateApi.delete(
          `/journal/${eventId}/${studentId}/${stageId}`
        );
        return response.data;
      } else {
        const response = await privateApi.post(
          `/journal/${eventId}/${studentId}/${stageId}`,
          { result_id: resultId }
        );
        return response.data;
      }
    },
    onMutate: async (variables) => {
      const { eventId, groupId, studentId, stageId, resultId } = variables;

      await queryClient.cancelQueries({
        queryKey: ["journal", eventId, groupId],
      });

      const previousJournal = queryClient.getQueryData<StudentJournal[]>([
        "journal",
        eventId,
        groupId,
      ]);

      // ИСПРАВЛЕННАЯ ТИПИЗАЦИЯ для setQueryData
      queryClient.setQueryData<StudentJournal[]>(
        ["journal", eventId, groupId],
        (oldData) => {
          if (!oldData) return oldData;

          return oldData.map((student) => {
            if (student.student_id === studentId) {
              const updatedStages = student.stages.map((stage) => {
                if (stage.stage_id === stageId) {
                  if (resultId === null) {
                    // УДАЛЕНИЕ - создаем корректный объект StageResult
                    return {
                      ...stage,
                      status: "незачет" as const,
                      current_score: 0,
                      result_title: null,
                      date: null,
                    };
                  } else {
                    // ОБНОВЛЕНИЕ
                    const selectedResult = stage.possible_results?.find(
                      (pr) => pr.id === resultId
                    );

                    if (selectedResult) {
                      const newStatus =
                        selectedResult.points >= stage.min_required_score
                          ? ("зачет" as const)
                          : ("незачет" as const);

                      return {
                        ...stage,
                        status: newStatus,
                        current_score: selectedResult.points,
                        result_title: selectedResult.title,
                        date: new Date().toISOString(),
                      };
                    }
                  }
                }
                return stage;
              });

              const total_score = updatedStages.reduce(
                (sum, s) => sum + s.current_score,
                0
              );
              const completed_stages_count = updatedStages.filter(
                (s) => s.status === "зачет"
              ).length;

              return {
                ...student,
                stages: updatedStages,
                total_score,
                completed_stages_count,
              };
            }
            return student;
          });
        }
      );

      return { previousJournal, variables };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousJournal) {
        queryClient.setQueryData(
          ["journal", context.variables.eventId, context.variables.groupId],
          context.previousJournal
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["journal", variables.eventId, variables.groupId],
      });
    },
  });
};
