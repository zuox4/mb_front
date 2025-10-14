import privateApi from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";

export interface ApiUserData {
  id: number;
  display_name: string; // исправил тип с number на string
  roles: string[] | string;
  image?: string;
  email: string;
  has_any_data: boolean;
  has_p_office: boolean;
  has_event_types: boolean;
  has_groups_leader: boolean;
  has_admin: boolean;
}

export const useUserData = (id: number | undefined) => {
  return useQuery<ApiUserData, Error>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await privateApi.get<ApiUserData>(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
    // Дополнительные опции для лучшего UX:
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
