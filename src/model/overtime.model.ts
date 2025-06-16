import { convertToTimeZone } from "../lib/utils"
import { OvertimeSchema } from "../schema/overtime.schema"

export type CreateOvertimeRequest = {
    user_id: number,
    hours: number
}

export type OvertimeResponse = {
    message: string,
    user_id: number,
    hours: number,
    created_at: Date,
    updated_at: Date,
}

export type Overtime = typeof OvertimeSchema.$inferSelect

export function toOvertimeResponse(data: Overtime): OvertimeResponse {
    return {
        message: "Overtime added successfully",
        user_id: data.user_id,
        hours: data.hours,
        created_at: convertToTimeZone(data.created_at),
        updated_at: convertToTimeZone(data.updated_at)
    }
}