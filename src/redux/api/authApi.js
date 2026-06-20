import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/admin-login",
        method: "POST",
        body: userInfo,
      }),
    }),
    logOut: builder.mutation({
      query: (body) => ({
        url: "/auth/log-out",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"], 
    }),
  }),
});

export const { useLoginMutation, useLogOutMutation  } = authApi;
