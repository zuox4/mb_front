// types/filters.ts
import { Dispatch, SetStateAction } from "react";

export interface Event {
  id: number;
  title: string;
  date_start?: string;
  date_end?: string;
  description?: string;
}

export interface Group {
  id: number;
  name: string;
  studentCount?: number;
}

export interface EventsListFilterProps {
  events: Event[];
  selectedEventId: number | null;
  setEventId: Dispatch<SetStateAction<number | null>>; // Для прямого использования setState
}

export interface GroupListFilterProps {
  groups: Group[];
  selectedGroupId: number | null;
  setGroupId: Dispatch<SetStateAction<number | null>>; // Для прямого использования setState
}
