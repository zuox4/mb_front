import privateApi from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";

export interface Office {
  id: number;
  title: string;
  accessible_classes: [
    {
      id: number;
      name: string;
    },
  ];
  logo_url: string;
  description: string;
  leader_uid: number;
}
export type OfficeResponse = Office[];

// получить все проектные оффисы
export const useOffices = () => {
  return useQuery<OfficeResponse, Error>({
    queryKey: ["admin-offices"],
    queryFn: async (): Promise<OfficeResponse> => {
      const res = await privateApi.get("/admin/get_offices");
      return res.data;
    },
  });
};
