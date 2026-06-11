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
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;
