import { baseApi } from "./baseApi";
import type {
  Task,
  Comment,
  Attachment,
  TaskStatus,
  PaginatedResult,
} from "@/types";
import type { TaskInput } from "@/schemas/task";

interface TaskFilters {
  status?: string;
  priority?: string;
  assigned_to?: string;
  project_id?: string;
  deadline_status?: string;
  sort_by?: string;
  page?: number;
  page_size?: number;
}

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<PaginatedResult<Task>, TaskFilters | void>({
      query: (params) => ({ url: "/tasks", params: params ?? undefined }),
      providesTags: ["Task"],
    }),
    getProjectTasks: builder.query<
      PaginatedResult<Task>,
      { id: string; filters?: TaskFilters }
    >({
      query: ({ id, filters }) => ({
        url: `/projects/${id}/tasks`,
        params: filters,
      }),
      providesTags: ["Task"],
    }),
    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Task", id }],
    }),
    createTask: builder.mutation<Task, { projectId: string; body: TaskInput }>({
      query: ({ projectId, body }) => ({
        url: `/projects/${projectId}/tasks`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Task", "Dashboard", "Activity"],
    }),
    updateTask: builder.mutation<Task, { id: string; body: Partial<TaskInput> }>({
      query: ({ id, body }) => ({ url: `/tasks/${id}`, method: "PUT", body }),
      invalidatesTags: ["Task", "Dashboard", "Activity"],
    }),
    updateTaskStatus: builder.mutation<Task, { id: string; status: TaskStatus }>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Task", "Dashboard", "Activity"],
    }),
    deleteTask: builder.mutation<null, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: ["Task", "Dashboard", "Activity"],
    }),

    // Comments
    getComments: builder.query<Comment[], string>({
      query: (taskId) => `/tasks/${taskId}/comments`,
      providesTags: ["Comment"],
    }),
    addComment: builder.mutation<Comment, { taskId: string; body: string }>({
      query: ({ taskId, body }) => ({
        url: `/tasks/${taskId}/comments`,
        method: "POST",
        body: { body },
      }),
      invalidatesTags: ["Comment", "Activity"],
    }),
    deleteComment: builder.mutation<null, string>({
      query: (id) => ({ url: `/comments/${id}`, method: "DELETE" }),
      invalidatesTags: ["Comment"],
    }),

    // Attachments
    getAttachments: builder.query<Attachment[], string>({
      query: (taskId) => `/tasks/${taskId}/attachments`,
      providesTags: ["Attachment"],
    }),
    uploadAttachment: builder.mutation<
      Attachment,
      { taskId: string; formData: FormData }
    >({
      query: ({ taskId, formData }) => ({
        url: `/tasks/${taskId}/attachments`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Attachment"],
    }),
    deleteAttachment: builder.mutation<null, string>({
      query: (id) => ({ url: `/attachments/${id}`, method: "DELETE" }),
      invalidatesTags: ["Attachment"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetProjectTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
} = tasksApi;
