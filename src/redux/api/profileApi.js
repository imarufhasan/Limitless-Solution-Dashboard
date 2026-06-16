import { baseApi } from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({ url: "/auth/me", method: "GET" }),
    }),
    updateProfile: builder.mutation({
      query: ({ name, address, phoneNumber, profileImage }) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("phoneNumber", phoneNumber);
        if (profileImage) {
          formData.append("profileImage", profileImage);
        }
        return {
          url: "/auth/update-profile",
          method: "PATCH",
          body: formData,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/auth/changed-password",
        method: "POST",
        body,
      }),
    }),
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "", status = "" } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (status) params.append("status", status);
        return { url: `/users/all?${params.toString()}`, method: "GET" };
      },
      providesTags: ["Users"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/auth/update-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users"],
    }),
    // {{baseUrl}}/content
    getContent: builder.query({
      query: (type) => `/content/${type}`, // ← was `/content?type=${type}`
      providesTags: (result, error, type) => [{ type: "Content", id: type }],
    }),

    // ── POST (create OR update) ───────────────────────────
    saveContent: builder.mutation({
      query: (body) => ({
        url: "/content",
        method: "POST",
        body, // { type, content }
      }),
      invalidatesTags: (result, error, { type }) => [
        { type: "Content", id: type },
      ],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useGetContentQuery,
  useSaveContentMutation,
} = profileApi;
