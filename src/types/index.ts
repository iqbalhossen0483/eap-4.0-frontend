// --- API response envelope (matches backend ApiResponse schema) ---

export interface PaginationMeta {
  total: number;
  current_page: number;
  total_page: number;
}

// Shape returned by RTK Query for paginated endpoints (after baseQueryWithReauth unwrap)
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

// RTK Query error data shape (success: false from backend)
export interface ApiError {
  success: false;
  message: string;
  details: string | null;
}

// --- Enums (mirror backend app/models/enums.py) ---

export type Role = "admin" | "project_manager" | "team_member";
export type ProjectStatus = "active" | "completed" | "on_hold";
export type TaskStatus = "todo" | "in_progress" | "completed";
export type Priority = "high" | "medium" | "low";

// --- Domain models ---

// Lightweight user shape used in nested relations (matches backend UserSummary)
export interface UserSummary {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  deadline: string; // ISO date string
  status: ProjectStatus;
  owner_id: string;
  task_count: number;
  created_at: string;
  updated_at: string;
}

// ProjectDetail extends ProjectRead with the owner object
export interface ProjectDetail extends Project {
  owner: UserSummary;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  assigned_to: string | null;
  assigned_user: UserSummary | null;
  due_date: string;
  priority: Priority;
  status: TaskStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  body: string;
  author: UserSummary;
  created_at: string;
}

export interface Attachment {
  id: string;
  task_id: string;
  original_filename: string;
  cloudinary_url: string;
  file_size: number;
  uploaded_by: UserSummary;
  created_at: string;
}

export interface Member {
  user_id: string;
  project_id: string;
  joined_at: string;
  user: UserSummary;
}

export interface Activity {
  id: string;
  actor: UserSummary;
  action: string; // e.g. 'task.created', 'project.updated'
  entity_type: string; // e.g. 'Task', 'Project'
  entity_id: string;
  project_id: string | null;
  detail: Record<string, unknown>;
  created_at: string;
}

export interface Notification {
  id: string;
  message: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

// --- Dashboard response shapes ---

export interface KPIStats {
  total_projects: number;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  deadline: string;
  task_count: number;
  completed_count: number;
  completion_percent: number;
}

export interface TasksByPriority {
  priority: Priority;
  count: number;
}

export interface TaskStatusDistribution {
  status: TaskStatus;
  count: number;
}

export interface TeamProductivity {
  user: UserSummary;
  role: Role;
  total: number;
  completed: number;
  pending: number;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  due_date: string;
  entity_type: string; // "task" or "project"
  project_name: string | null;
}

export interface HighPriorityTask {
  id: string;
  title: string;
  project_id: string;
  project_name: string;
  priority: Priority;
  status: TaskStatus;
  due_date: string;
}

export interface DashboardResponse {
  kpi: KPIStats;
  project_summaries: ProjectSummary[];
  tasks_by_priority: TasksByPriority[];
  task_status_distribution: TaskStatusDistribution[];
  team_productivity: TeamProductivity[];
  upcoming_deadlines: UpcomingDeadline[];
  high_priority_tasks: HighPriorityTask[];
}

// Member workload (Team page / GET /dashboard/team-productivity)
export interface MemberWorkload {
  user: UserSummary;
  role: Role;
  total: number;
  completed: number;
  pending: number;
}

// Search results (GET /search?q=)
export interface SearchResult {
  projects: Project[];
  tasks: Task[];
  users: User[];
}
