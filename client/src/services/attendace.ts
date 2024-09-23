import { createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'

import { AttendanceListResponse, ClockInOutRequest } from '@/types/attendance'
import { apiBaseQuery } from '@/utils/api'

const api = createApi({
  reducerPath: 'attendance',
  baseQuery: apiBaseQuery,
  tagTypes: ['Attendance'],
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 259200, // 3 days
  endpoints: (builder) => ({
    getListAttendance: builder.query<AttendanceListResponse, void>({
      query: () => ({
        url: '/attendance',
      }),
      providesTags: ['Attendance'],
    }),
    clockIn: builder.mutation<void, ClockInOutRequest>({
      query: (data) => ({
        url: '/attendance/clock-in',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    clockOut: builder.mutation<void, ClockInOutRequest>({
      query: (data) => ({
        url: '/attendance/clock-out',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
})

// Export hooks for usage in functional components
export const { useGetListAttendanceQuery, useClockInMutation, useClockOutMutation } = api

export default api
