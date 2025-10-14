// types/event.ts
export type PossibleResult = {
  id?: number;
  title: string;
  points_for_done: number;
  stage_id?: number;
};

export type Stage = {
  id?: number;
  title: string;
  min_score_for_finished: number;
  stage_order: number;
  event_type_id?: number;
  possible_results: PossibleResult[];
};

export type EventType = {
  id?: number;
  title: string;
  description: string;
  leader_id?: number | null;
  min_stages_for_completion: number;
  stages: Stage[];
  leader?: {
    id: number;
    display_name: string | null;
    email: string;
  } | null;
};
