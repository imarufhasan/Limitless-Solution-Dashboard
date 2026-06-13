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

    // {{baseUrl}}/employee
    createEmployee: builder.mutation({
      query: (body) => ({
        url: "/employee",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employee"],
    }),
    getAvailableEmployees: builder.query({
      query: ({ page = 1, limit = 10, workingStatus = "available" } = {}) => ({
        url: "/employee/all",
        params: { page, limit, workingStatus },
      }),
      providesTags: ["Employee"],
    }),

    assignEmployee: builder.mutation({
      query: (body) => ({
        url: "/assignment",
        method: "POST",
        body,
      }),
      // Invalidate the order so ReviewQuotePage re-fetches updated status
      invalidatesTags: ["Assignment"],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useGetEmployeeAnalyticsQuery,
  useCreateEmployeeMutation,
  useGetAvailableEmployeesQuery,
  useAssignEmployeeMutation,
} = employeeApi;
