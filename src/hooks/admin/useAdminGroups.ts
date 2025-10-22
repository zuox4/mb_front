import privateApi from "@/services/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// получить все мероприятия
export const useGroups = () => {
  return useQuery<GroupResponse, Error>({
    queryKey: ["admin-all-groups"],
    queryFn: async (): Promise<GroupResponse> => {
      const res = await privateApi.get("/admin/all_groups");
      return res.data;
    },
  });
};

export interface Group {
  id: number;
  name: string;
  project_offices?: Array<{
    id: number;
    title: string;
    logo_url?: string;
  }>;
}
export type GroupResponse = Group[];

export interface CreateGroupData {
  name: string;
}

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<Group, Error, CreateGroupData>({
    mutationFn: async (groupData: CreateGroupData) => {
      // Исправляем: убираем лишнюю обертку {groupData} и используем POST для создания
      const res = await privateApi.post("/admin/create-group", groupData);
      return res.data;
    },

    onSuccess: () => {
      // Инвалидируем кэш групп
      queryClient.invalidateQueries({
        queryKey: ["admin-all-groups"],
      });
    },

    onError: (error) => {
      console.error("Failed to create group:", error);
    },
  });
};
