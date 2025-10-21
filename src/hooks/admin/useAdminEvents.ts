import privateApi from "@/services/api/api"
import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios"

// Тип для отдельного события
export interface Event {
  event_type_id: number
  title: string
  academic_year: string
  date_end: string | null
  id: number
  description: string | null
  date_start: string | null
  is_active: boolean
}

// Тип для ответа API
export type EventsResponse = Event[]


export interface CreateEventData {
  event_type_id: number
  title: string
  academic_year: string
  date_end?: string | null
  description?: string | null
  date_start?: string | null
  is_active?: boolean
}

export interface CreateEventResponse {
  id: number
  event_type_id: number
  title: string
  academic_year: string
  date_end: string | null
  description: string | null
  date_start: string | null
  is_active: boolean
}


// получить все мероприятия
export const useEvents = () => {
  return useQuery<EventsResponse, Error>({
    queryKey: ['admin-all-events'],
    queryFn: async (): Promise<EventsResponse> => {
      const res = await privateApi.get('/admin/all_events')
      return res.data
    }
  })
}
// создать мероприятие
export const useCreateEvent = (): UseMutationResult<
  CreateEventResponse,
  Error,
  CreateEventData,
  unknown
> => {
  return useMutation({
    mutationFn: async (eventData: CreateEventData): Promise<CreateEventResponse> => {
      const res: AxiosResponse<CreateEventResponse> = await privateApi.post('/admin/create_event', eventData)
      return res.data
    },
    onSuccess: ()=>alert('Успешно')
  })
}
