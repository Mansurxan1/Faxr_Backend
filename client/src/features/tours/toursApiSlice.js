import { apiSlice } from "../../app/api/apiSlice";

export const toursApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Получение всех туров
    getTours: builder.query({
      query: () => "/tours",
      providesTags: (result) => {
        // Проверяем, что result существует, является объектом и имеет data как массив
        if (result && result.data && Array.isArray(result.data)) {
          return [
            ...result.data.map(({ _id }) => ({ type: "Tour", id: _id })),
            { type: "Tour", id: "LIST" },
          ];
        } else if (result && Array.isArray(result)) {
          return [
            ...result.map(({ _id }) => ({ type: "Tour", id: _id })),
            { type: "Tour", id: "LIST" },
          ];
        }
        return [{ type: "Tour", id: "LIST" }];
      },
    }),

    // Получение тура по ID
    getTourById: builder.query({
      query: (id) => `/tours/${id}`,
      providesTags: (result, error, id) => [{ type: "Tour", id }],
    }),

    // Создание нового тура
    createTour: builder.mutation({
      query: (tour) => {
        // Для отправки изображения используем FormData
        const formData = new FormData();

        // Добавляем все данные тура в FormData
        Object.keys(tour).forEach((key) => {
          if (key !== "image") {
            // Если это объект или массив, преобразуем в JSON строку
            if (typeof tour[key] === "object" && tour[key] !== null) {
              formData.append(key, JSON.stringify(tour[key]));
            } else {
              formData.append(key, tour[key]);
            }
          }
        });

        // Добавляем изображение, если оно есть
        if (tour.image) {
          formData.append("image", tour.image);
        }

        return {
          url: "/tours",
          method: "POST",
          body: formData,
          // Важно: не устанавливать Content-Type, он будет автоматически установлен как multipart/form-data
          formData: true,
        };
      },
      invalidatesTags: [{ type: "Tour", id: "LIST" }],
    }),

    // Обновление тура
    updateTour: builder.mutation({
      query: ({ id, ...tour }) => {
        // Для отправки изображения используем FormData
        const formData = new FormData();

        // Добавляем все данные тура в FormData
        Object.keys(tour).forEach((key) => {
          if (key !== "image") {
            // Если это объект или массив, преобразуем в JSON строку
            if (typeof tour[key] === "object" && tour[key] !== null) {
              formData.append(key, JSON.stringify(tour[key]));
            } else {
              formData.append(key, tour[key]);
            }
          }
        });

        // Добавляем изображение, если оно есть
        if (tour.image) {
          formData.append("image", tour.image);
        }

        return {
          url: `/tours/${id}`,
          method: "PUT",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Tour", id },
        { type: "Tour", id: "LIST" },
      ],
    }),

    // Удаление тура
    deleteTour: builder.mutation({
      query: (id) => ({
        url: `/tours/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Tour", id: "LIST" }],
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
