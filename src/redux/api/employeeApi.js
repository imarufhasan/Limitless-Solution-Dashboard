import { baseApi } from "./baseApi";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployees: builder.query({
      query: ({
        page = 1,
        limit = 10,
        searchTerm = "",
        workingStatus,
      } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (searchTerm) params.set("searchTerm", searchTerm);
        if (workingStatus) params.set("workingStatus", workingStatus);
        return `/employee/all?${params.toString()}`;
      },
      providesTags: ["Employee"],
    }),

    getEmployeeAnalytics: builder.query({
      query: () => "/analytics/employee",
      providesTags: ["Employee"],
    }),
  }),
});

export const { useGetAllEmployeesQuery, useGetEmployeeAnalyticsQuery } =
  employeeApi;
