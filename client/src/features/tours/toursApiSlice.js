import { apiSlice } from "../../app/api/apiSlice";

export const toursApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Получение всех туров
    getTours: builder.query({
      query: () => "/api/tours",
      providesTags: ["Tours"],
    }),

    // Получение тура по ID
    getTourById: builder.query({
      query: (id) => `/api/tours/${id}`,
      providesTags: (result, error, id) => [{ type: "Tour", id }],
    }),

    // Создание нового тура
    createTour: builder.mutation({
      query: (tourData) => ({
        url: "/api/tours",
        method: "POST",
        body: tourData,
      }),
      invalidatesTags: ["Tours"],
    }),

    // Обновление тура
    updateTour: builder.mutation({
      query: ({ id, ...tourData }) => ({
        url: `/api/tours/${id}`,
        method: "PUT",
        body: tourData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Tours" },
        { type: "Tour", id },
      ],
    }),

    // Удаление тура
    deleteTour: builder.mutation({
      query: (id) => ({
        url: `/api/tours/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tours"],
    }),
  }),
});

export const {
  useGetToursQuery,
  useGetTourByIdQuery,
  useCreateTourMutation,
  useUpdateTourMutation,
  useDeleteTourMutation,
} = toursApiSlice;
