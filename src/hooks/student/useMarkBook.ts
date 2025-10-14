import { privateApi } from "@/services/api/api";
import { useQuery } from "@tanstack/react-query";
import { useStudentData } from "./useStudentData";

export interface StageMark {
  name: string;
  status: "зачет" | "незачет";
  date: string | null;
  result_title: string | null; // Название результата
  score: number | null; // Баллы за этап
}

export interface EventMark {
  id: number;
  eventName: string;
  type: "зачет" | "незачет";
  date: string;
  stages: StageMark[];
  total_score: number; // Общая сумма баллов
}

export interface RecordBookResponse {
  marks: EventMark[];
}

const getProjectData = async (): Promise<RecordBookResponse> => {
  const res = await privateApi.get<RecordBookResponse>(
    "/student/record-book/marks"
  );
  console.log(res.data);
  return res.data;
};
// # получаем проект
export const useMarkBookData = () => {
  const { data } = useStudentData();
  return useQuery<RecordBookResponse>({
    queryKey: ["markBook"],
    queryFn: getProjectData,
    staleTime: 10 * 60 * 1000, // 10 минут - данные считаются свежими
    enabled: !!data?.project_office_id,
  });
};
