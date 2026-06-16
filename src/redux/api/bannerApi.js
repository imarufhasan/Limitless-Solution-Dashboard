// src/redux/api/bannerApi.js
import { baseApi } from "./baseApi";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanners: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/banner/all?page=${page}&limit=${limit}`,
      providesTags: ["Banner"],
    }),

    uploadBanners: builder.mutation({
      query: (formData) => ({
        url: "/banner",
        method: "POST",
        body: formData, // FormData with multiple "banner" fields
      }),
      invalidatesTags: ["Banner"],
    }),

    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useUploadBannersMutation,
  useDeleteBannerMutation,
} = bannerApi;