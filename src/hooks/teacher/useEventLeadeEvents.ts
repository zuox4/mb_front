import privateApi from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";

export const useEventsForLeaderEvent = () => {
  return useQuery({
    queryKey: ["event_types_for_leader_events"],
    queryFn: async () => {
      const res = await privateApi.get("/event-leader/events");
      return res.data;
    },
  });
};
