import { convertToTimeZone } from "../lib/utils"
import { AttendanceSchema } from "../schema/attendance.schema"

export type CreateAttendanceRequest = {
    user_id: number
}

export type AttendanceResponse = {
    message: string
    user_id: number
    created_at: Date
    updated_at: Date
}

export type Attendance = typeof AttendanceSchema.$inferSelect

export function toAttendanceResponse(data: Attendance): AttendanceResponse {
    return {
        message: "Attendance successfully",
        user_id: data.user_id,
        created_at: convertToTimeZone(data.created_at),
        updated_at: convertToTimeZone(data.updated_at)
    }
}