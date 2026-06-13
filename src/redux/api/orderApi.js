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
    sendVehicleQuote: builder.mutation({
      query: ({ id, body }) => ({
        url: `/order/vehicle/qoute/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderAnalyticsQuery,
  useGetOrderByIdQuery,
  useSendVehicleQuoteMutation,
} = orderApi;
