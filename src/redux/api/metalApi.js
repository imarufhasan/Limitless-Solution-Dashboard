import { baseApi } from "./baseApi";

export const metalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMetals: builder.query({
      query: ({ page = 1, limit = 20, searchTerm = "" } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (searchTerm) params.append("searchTerm", searchTerm);
        return { url: `/metal/all?${params.toString()}`, method: "GET" };
      },
      providesTags: ["Metal"], // ← was "Metals"
    }),

    createMetal: builder.mutation({
      query: (body) => ({
        url: "/metal",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Metal"],
    }),

    updateMetal: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/metal/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Metal"],
    }),
  }),
});

export const {
  useGetAllMetalsQuery,
  useCreateMetalMutation,
  useUpdateMetalMutation,
} = metalApi;
