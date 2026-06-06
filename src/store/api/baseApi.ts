import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { signOut } from "next-auth/react";
import type { RootState } from "@/store";
import type { PaginationMeta } from "@/types";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).token.accessToken; // synchronous — no network
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// Wraps rawBaseQuery — unwraps ApiResponse envelope and handles 401 globally
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    await signOut({ callbackUrl: "/login" });
    return result;
  }

  // Unwrap ApiResponse: { success, message, data, meta? }
  // Paginated → returns { items, meta } so components can access both
  // Non-paginated → returns data directly
  if (
    result.data &&
    typeof result.data === "object" &&
    "success" in (result.data as object)
  ) {
    const envelope = result.data as {
      success: boolean;
      message: string;
      data: unknown;
      meta?: PaginationMeta;
    };
    if (envelope.success) {
      return {
        data: envelope.meta
          ? { items: envelope.data, meta: envelope.meta }
          : envelope.data,
      };
    }
    // success: false — surface as RTK error so .isError triggers
    return {
      error: {
        status: "CUSTOM_ERROR",
        error: envelope.message,
        data: envelope,
      } as FetchBaseQueryError,
    };
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Project",
    "Task",
    "Member",
    "User",
    "Dashboard",
    "Activity",
    "Notification",
    "Comment",
    "Attachment",
  ],
  endpoints: () => ({}),
});
