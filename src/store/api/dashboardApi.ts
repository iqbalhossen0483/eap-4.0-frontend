import { baseApi } from "./baseApi";
import type {
  DashboardResponse,
  KPIStats,
  ProjectSummary,
  TasksByPriority,
  TaskStatusDistribution,
  TeamProductivity,
  UpcomingDeadline,
  HighPriorityTask,
} from "@/types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),
    getKPI: builder.query<KPIStats, void>({
      query: () => "/dashboard/kpi",
      providesTags: ["Dashboard"],
    }),
    getProjectSummaries: builder.query<ProjectSummary[], void>({
      query: () => "/dashboard/project-summaries",
      providesTags: ["Dashboard"],
    }),
    getTasksByPriority: builder.query<TasksByPriority[], void>({
      query: () => "/dashboard/tasks-by-priority",
      providesTags: ["Dashboard"],
    }),
    getTaskStatusDistribution: builder.query<TaskStatusDistribution[], void>({
      query: () => "/dashboard/task-status-distribution",
      providesTags: ["Dashboard"],
    }),
    getTeamProductivity: builder.query<TeamProductivity[], void>({
      query: () => "/dashboard/team-productivity",
      providesTags: ["Dashboard"],
    }),
    getUpcomingDeadlines: builder.query<UpcomingDeadline[], void>({
      query: () => "/dashboard/upcoming-deadlines",
      providesTags: ["Dashboard"],
    }),
    getHighPriorityTasks: builder.query<HighPriorityTask[], void>({
      query: () => "/dashboard/high-priority-tasks",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetKPIQuery,
  useGetProjectSummariesQuery,
  useGetTasksByPriorityQuery,
  useGetTaskStatusDistributionQuery,
  useGetTeamProductivityQuery,
  useGetUpcomingDeadlinesQuery,
  useGetHighPriorityTasksQuery,
} = dashboardApi;
