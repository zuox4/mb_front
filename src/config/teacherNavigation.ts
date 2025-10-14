// config/navigation.ts
export interface NavItem {
  to: string;
  label: string;
  icon?: string;
  description?: string;
  requiredRole?: string;
}

export const teacherNavItems: NavItem[] = [
  {
    to: "",
    label: "Главная",
    icon: "🏠",
    description: "Обзор системы",
  },
  {
    to: "admin",
    label: "Администратор",
    icon: "⚙️",
    description: "Управление системой",
    requiredRole: "admin",
  },
  {
    to: "class-leader",
    label: "Классное руководство",
    icon: "👨‍🏫",
    description: "Управление классом",
    requiredRole: "group_leader",
  },
  {
    to: "project-leader",
    label: "Проектный офис",
    icon: "🏢",
    description: "Управление проектами",
    requiredRole: "project_leader",
  },
  {
    to: "event-leader",
    label: "Мои мероприятия",
    icon: "📊",
    description: "Мероприятия и результаты",
    requiredRole: "event_leader",
  },
];

// Дополнительные конфигурации навигации для других ролей
export const studentNavItems: NavItem[] = [
  { to: "", label: "Главная", icon: "🏠" },
  { to: "achievements", label: "Мои достижения", icon: "🏆" },
  { to: "events", label: "Мероприятия", icon: "📅" },
];
