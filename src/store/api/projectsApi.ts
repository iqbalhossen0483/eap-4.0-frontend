import { baseApi } from "./baseApi";
import type { Project, ProjectDetail, Member, PaginatedResult } from "@/types";
import type { ProjectInput } from "@/schemas/project";

interface ProjectFilters {
  search?: string;
  status?: string;
  sort_by?: string;
  page?: number;
  page_size?: number;
}

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<PaginatedResult<Project>, ProjectFilters | void>({
      query: (params) => ({ url: "/projects", params: params ?? undefined }),
      providesTags: ["Project"],
    }),
    getProject: builder.query<ProjectDetail, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation<Project, ProjectInput>({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      invalidatesTags: ["Project", "Dashboard", "Activity"],
    }),
    updateProject: builder.mutation<Project, { id: string; body: Partial<ProjectInput> }>({
      query: ({ id, body }) => ({ url: `/projects/${id}`, method: "PUT", body }),
      invalidatesTags: ["Project", "Activity"],
    }),
    deleteProject: builder.mutation<null, string>({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
      invalidatesTags: ["Project", "Dashboard", "Activity"],
    }),
    getProjectMembers: builder.query<Member[], string>({
      query: (id) => `/projects/${id}/members`,
      providesTags: ["Member"],
    }),
    addMember: builder.mutation<Member, { id: string; user_id: string }>({
      query: ({ id, user_id }) => ({
        url: `/projects/${id}/members`,
        method: "POST",
        body: { user_id },
      }),
      invalidatesTags: ["Member", "Activity"],
    }),
    removeMember: builder.mutation<null, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `/projects/${id}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Member", "Activity"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectMembersQuery,
  useAddMemberMutation,
  useRemoveMemberMutation,
} = projectsApi;
