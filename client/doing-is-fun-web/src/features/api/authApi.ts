import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User, LoginPayload, RegisterPayload } from "../../types/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/auth",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<{ user: User; accessToken: string }, LoginPayload>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<
      { user: User; accessToken: string },
      RegisterPayload
    >({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    me: builder.query<unknown, void>({
      query: () => ({
        url: "/me",
        method: "GET",
        headers: {},
      }),
    }),
    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: "/refresh",
        method: "POST",
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;
