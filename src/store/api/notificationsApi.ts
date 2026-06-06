import { baseApi } from "./baseApi";
import type { Notification, PaginatedResult } from "@/types";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      PaginatedResult<Notification>,
      { page?: number; page_size?: number } | void
    >({
      query: (params) => ({ url: "/notifications", params: params ?? undefined }),
      providesTags: ["Notification"],
    }),
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => "/notifications/unread-count",
      providesTags: ["Notification"],
    }),
    markRead: builder.mutation<Notification, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
    markAllRead: builder.mutation<null, void>({
      query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation<null, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
