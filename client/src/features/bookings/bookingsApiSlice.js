import { apiSlice } from "../../app/api/apiSlice";

export const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Получение всех бронирований (только для админа)
    getAllBookings: builder.query({
      query: () => "/bookings",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Booking", id: _id })),
              { type: "Booking", id: "LIST" },
            ]
          : [{ type: "Booking", id: "LIST" }],
    }),

    // Получение бронирований текущего пользователя
    getMyBookings: builder.query({
      query: () => "/bookings/my-bookings",
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Booking", id: _id })),
              { type: "Booking", id: "MY_LIST" },
            ]
          : [{ type: "Booking", id: "MY_LIST" }],
    }),

    // Получение бронирования по ID
    getBookingById: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    // Создание нового бронирования
    createBooking: builder.mutation({
      query: (booking) => ({
        url: "/bookings",
        method: "POST",
        body: booking,
      }),
      invalidatesTags: [
        { type: "Booking", id: "LIST" },
        { type: "Booking", id: "MY_LIST" },
      ],
    }),

    // Обновление статуса бронирования (только для админа)
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Booking", id },
        { type: "Booking", id: "LIST" },
        { type: "Booking", id: "MY_LIST" },
      ],
    }),

    // Удаление бронирования (только для админа)
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Booking", id: "LIST" },
        { type: "Booking", id: "MY_LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
} = bookingsApiSlice;
