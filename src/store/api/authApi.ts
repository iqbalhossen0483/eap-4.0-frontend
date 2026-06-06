import { baseApi } from "./baseApi";
import type { User } from "@/types";

interface SignupBody {
  name: string;
  email: string;
  password: string;
}

interface ProfileBody {
  name?: string;
  avatar_url?: string;
}

interface ChangePasswordBody {
  current_password: string;
  new_password: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<User, SignupBody>({
      query: (body) => ({ url: "/auth/signup", method: "POST", body }),
    }),
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<User, ProfileBody>({
      query: (body) => ({ url: "/auth/profile", method: "PUT", body }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<null, ChangePasswordBody>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
    }),
  }),
});

export const {
  useSignupMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
