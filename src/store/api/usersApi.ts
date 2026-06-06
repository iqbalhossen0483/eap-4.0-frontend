import { baseApi } from "./baseApi";
import type { User, PaginatedResult } from "@/types";

interface UserFilters {
  search?: string;
  page?: number;
  page_size?: number;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResult<User>, UserFilters | void>({
      query: (params) => ({ url: "/users", params: params ?? undefined }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
