import { baseApi } from "./base-api";
import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "@/lib/auth/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: AuthUser; accessToken: string; refreshToken: string },
      LoginCredentials
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation<
      { user: AuthUser; accessToken: string; refreshToken: string },
      RegisterCredentials
    >({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),

    getProfile: builder.query<AuthUser, void>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<AuthUser, Partial<AuthUser>>({
      query: (updates) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["User"],
    }),

    refreshToken: builder.mutation<
      { accessToken: string },
      { refreshToken: string }
    >({
      query: ({ refreshToken }) => ({
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useRefreshTokenMutation,
} = authApi;
