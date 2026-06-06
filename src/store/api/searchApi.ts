import { baseApi } from "./baseApi";
import type { SearchResult } from "@/types";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<SearchResult, string>({
      query: (q) => ({ url: "/search", params: { q } }),
      // no cache tag — always fresh
    }),
  }),
});

export const { useSearchQuery } = searchApi;
