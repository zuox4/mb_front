// hooks/useProjectOfficePivot.ts
import privateApi from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";

export interface PivotStudent {
  id: number;
  student_name: string;
  group_name: string;
  class_teacher?: string; // Делаем опциональным
  events: {
    [eventId: string]: {
      event_name: string;
      total_score: number;
      completed_stages_count: number;
      min_stages_required: number;
      is_important: boolean;
      status: "зачет" | "незачет" | "в процессе" | "не начато";
      stages: Array<{
        name: string;
        status: string;
        current_score: number;
        min_required_score: number,
        result_title: string, 
      }>;
    };
  };
}

export const useProjectOfficePivot = (selectedGroups: string[] = [], p_office_id: string='') => {
  return useQuery<PivotStudent[], Error>({
    queryKey: ["project-office-pivot", selectedGroups, p_office_id],
    queryFn: async (): Promise<PivotStudent[]> => {
      const params = new URLSearchParams();

      // Добавляем группы в параметры запроса
      if (selectedGroups.length > 0) {
        selectedGroups.forEach((group) => {
          params.append("groups", group);
        });
      }
      if (p_office_id) {
          params.append('p_office_id', p_office_id)
        }
      
      
      const response = await privateApi.get(
        "/project-office/pivot-data-optimized",
        {
          params,
          
        }
      );
      return response.data;
    },
    enabled: true, // Всегда включен, но фильтруется по selectedGroups
  });
};
