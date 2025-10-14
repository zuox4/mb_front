import privateApi from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";

export const useAllGroups = () => {
  return useQuery({
    queryKey: ["all-groups"],
    queryFn: async () => {
      const response = await privateApi.get("/groups/all");
      return response.data;
    },
  });
};
