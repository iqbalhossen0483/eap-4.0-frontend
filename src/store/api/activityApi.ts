import { baseApi } from "./baseApi";
import type { Activity, PaginatedResult } from "@/types";

interface ActivityFilters {
  project_id?: string;
  actor_id?: string;
  limit?: number;
  page?: number;
}

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivity: builder.query<PaginatedResult<Activity>, ActivityFilters | void>({
      query: (params) => ({ url: "/activity", params: params ?? undefined }),
      providesTags: ["Activity"],
    }),
  }),
});

export const { useGetActivityQuery } = activityApi;
