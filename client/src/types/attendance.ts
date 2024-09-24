import { BaseRequest } from './common'

export interface AttendanceListResponse {
  data: any
  attendances: Attendance[]
}

export interface AttendanceDetailResponse {
  attendance: Attendance
}

// types.ts
export interface AuthState {
  staffId: string
  // tambahkan properti lain sesuai kebutuhan
}

export interface RootState {
  auth: AuthState
  // tambahkan slice lain sesuai kebutuhan
}

export interface ClockInOutRequest {
  staffId: string // atau gunakan UUID sesuai dengan kebutuhan Anda
  // clockin?: string // saat clock in
  // clockout?: string // saat clock out
}

// Contoh tipe Attendance (jika diperlukan)
export interface Attendance {
  id: string // UUID
  clockin: string
  clockout: string
  staff: {
    id: string // UUID
    name: string // Nama staff
    // Tambahkan field lain yang diperlukan
  }
}

export type ClockRequest = BaseRequest<ClockInOutRequest>
