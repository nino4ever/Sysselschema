export type Language = 'sv' | 'en' | 'ar';

export type Theme = 'dark' | 'light' | 'nordic' | 'forest' | 'sunset';

export type TaskCategory = string;

export interface CategoryItem {
  id: string;
  name: string;
  icon: string; // symbol / emoji
  color?: string;
  isCustom?: boolean;
}

export type AgeGroup = 'adult' | 'teen' | 'child';

export interface Member {
  id: string;
  name: string;
  avatar: string; // emoji or icon
  color: string; // hex or tailwind class identifier
  role: string; // e.g. "Förälder", "Barn", "Mamma", "Pappa"
  ageGroup: AgeGroup;
  capacityWeight: number; // 1.0 (100% full), 0.75, 0.5 (child), etc.
  availableDays: number[]; // 0 = Monday, 1 = Tuesday ... 6 = Sunday
  preferredCategories?: TaskCategory[];
  dislikedCategories?: TaskCategory[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: TaskCategory;
  color?: string; // hex color for task styling
  points?: number;
  estimatedMinutes?: number;
  frequencyPerWeek: number; // 1 to 7
  preferredDays?: number[]; // [0, 4] for Mon & Fri, etc.
  requiredAgeGroup?: AgeGroup; // e.g. child suitable or adult only
  icon?: string;
  lockedMemberId?: string; // force assign to someone
}

export interface ScheduleItem {
  id: string;
  taskId: string;
  memberId: string;
  dayIndex: number; // 0 = Mon, 1 = Tue, ..., 6 = Sun
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface WeeklyPlan {
  id: string;
  title: string; // e.g., "Vecka 34 (2026)"
  weekNumber: number;
  year: number;
  startDate: string; // ISO date string for Monday
  items: ScheduleItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedPreset {
  id: string;
  name: string;
  createdAt: string;
  tasks: Task[];
  members: Member[];
  plan: WeeklyPlan;
}
