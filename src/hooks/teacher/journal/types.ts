export interface PossibleResult {
  id: number;
  title: string;
  points: number;
}

export interface StageResult {
  name: string;
  status: "зачет" | "незачет";
  date: string | null;
  result_title: string | null;
  score: number;
  min_required_score: number;
  current_score: number;
  stage_id: number;
  possible_results: PossibleResult[];
}

export interface StudentJournal {
  id: number;
  student_id: number;
  student_name: string;
  event_name: string;
  type: string;
  date: string;
  stages: StageResult[];
  total_score: number;
  min_stages_required: number;
  completed_stages_count: number;
}

// ИСПРАВЛЕННЫЙ ТИП: resultId может быть number или null
export interface UpdateResultVariables {
  eventId: number;
  studentId: number;
  stageId: number;
  resultId: number | null; // Добавляем null
  teacherId: number;
  groupId: number;
}

export interface StageInfo {
  name: string;
  stage_id: number;
  min_required_score: number;
}
