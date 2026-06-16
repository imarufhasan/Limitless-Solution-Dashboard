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

   
  }),
});

export const {
  useLoginMutation,
} = authApi;