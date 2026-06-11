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
      providesTags: ["Metals"],
    }),
  }),
});

export const { useGetAllMetalsQuery } = metalApi;