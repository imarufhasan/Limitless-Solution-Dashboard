import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: ({ page = 1, limit = 10, status, searchTerm } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (status) params.set("status", status);
        if (searchTerm) params.set("searchTerm", searchTerm);
        return `/order/admin/all?${params.toString()}`;
      },
      providesTags: ["Order"],
    }),

    getOrderAnalytics: builder.query({
      query: () => "/analytics/order",
      providesTags: ["Order"],
    }),
    getOrderById: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderAnalyticsQuery,
  useGetOrderByIdQuery,
} = orderApi;
