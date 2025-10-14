// hooks/useEventTypes.ts
import privateApi from "@/services/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchAllTypesEvents = async () => {
  try {
    const res = await privateApi.get("/event-types/all_event_types");
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw Error(`Ошибка получения мероприятий:${error}}`);
  }
};

export const useEventTypes = () => {
  return useQuery({
    queryKey: ["event_types"],
    queryFn: fetchAllTypesEvents,
    staleTime: 10 * 60 * 1000, // 10 минут - данные считаются свежими
  });
};

// Хук для создания типа мероприятия
interface CreateEventTypeData {
  title: string;
  description?: string | null;
  leader_id?: number | null;
  min_stages_for_completion?: number;
  stages: Array<{
    title: string;
    min_score_for_finished: number;
    stage_order: number;
    possible_results: Array<{
      title: string;
      points_for_done: number;
    }>;
  }>;
}

const createEventType = async (data: CreateEventTypeData) => {
  try {
    const res = await privateApi.post("/event-types", data);
    return res.data;
  } catch (error) {
    throw Error(`Ошибка создания типа мероприятия: ${error}`);
  }
};

export const useCreateEventType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEventType,
    onSuccess: () => {
      // Инвалидируем кэш списка типов мероприятий
      queryClient.invalidateQueries({ queryKey: ["event_types"] });
    },
    onError: (error: Error) => {
      console.error("Ошибка при создании типа мероприятия:", error);
    },
  });
};

// Хук для обновления типа мероприятия
interface UpdateEventTypeData extends Partial<CreateEventTypeData> {
  id: number;
}

const updateEventType = async ({ id, ...data }: UpdateEventTypeData) => {
  try {
    const res = await privateApi.put(`/event-types/event_types/${id}`, data);
    return res.data;
  } catch (error) {
    throw Error(`Ошибка обновления типа мероприятия: ${error}`);
  }
};

export const useUpdateEventType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEventType,
    onSuccess: (_data, variables) => {
      // Инвалидируем кэш списка типов мероприятий
      queryClient.invalidateQueries({ queryKey: ["event_types"] });
      // Также инвалидируем конкретный тип мероприятия если он кэширован отдельно
      queryClient.invalidateQueries({ queryKey: ["event_type", variables.id] });
    },
    onError: (error: Error) => {
      console.error("Ошибка при обновлении типа мероприятия:", error);
    },
  });
};

// Хук для удаления типа мероприятия
const deleteEventType = async (id: number) => {
  try {
    const res = await privateApi.delete(`/event-types/event_types/${id}`);
    return res.data;
  } catch (error) {
    throw Error(`Ошибка удаления типа мероприятия: ${error}`);
  }
};

export const useDeleteEventType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEventType,
    onSuccess: () => {
      // Инвалидируем кэш списка типов мероприятий
      queryClient.invalidateQueries({ queryKey: ["event_types"] });
    },
    onError: (error: Error) => {
      console.error("Ошибка при удалении типа мероприятия:", error);
    },
  });
};
