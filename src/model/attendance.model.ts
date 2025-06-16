import { AttendanceSchema } from "../schema/attendance.schema"

export type CreateAttendanceRequest = {
    user_id: number
}

export type AttendanceResponse = {
    user_id: number
    created_at: Date
    updated_at: Date
}

export type Attendance = typeof AttendanceSchema.$inferSelect

export function toAttendanceResponse(data: Attendance): AttendanceResponse {
    return {
        user_id: data.id,
        created_at: data.created_at,
        updated_at: data.updated_at
    }
}