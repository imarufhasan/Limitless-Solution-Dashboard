import { baseApi } from "../api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: ({ purchaseGrowthYear, customerGrowthYear }) => ({
        url: `/analytics/dashboard?purchaseGrowthYear=${purchaseGrowthYear}&customerGrowthYear=${customerGrowthYear}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery } = dashboardApi;