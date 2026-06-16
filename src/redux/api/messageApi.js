import { baseApi } from "./baseApi";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    conversation: builder.query({
      query: (id) => ({
        url: `/conversation/${id}/messages`,
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),

    supportConversations: builder.query({
      query: () => ({
        url: "/conversation/all/support",
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),
  }),
});

export const {
  useConversationQuery,
  useSupportConversationsQuery,
} = messageApi;