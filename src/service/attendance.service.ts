import { and, eq, sql } from "drizzle-orm";
import db from "../config/database";
import { Attendance, AttendanceResponse, CreateAttendanceRequest, toAttendanceResponse } from "../model/attendance.model";
import { AttendanceSchema } from "../schema/attendance.schema";

export class AttendanceService {
    static async create(request: CreateAttendanceRequest): Promise<AttendanceResponse> {
        try {
            // Cek apakah hari ini hari weekend (sabtu atau minggu)
            const today = new Date()
            const isWeekend = today.getDay() === 0 || today.getDay() === 6

            if (isWeekend) {
                throw new Error("Hari ini adalah hari weekend, tidak dapat absen")
            }

            // Cek apakah sudah pernah absen hari ini
            const existingAttendance = await db
                .select()
                .from(AttendanceSchema)
                .where(
                    and(
                        eq(AttendanceSchema.user_id, request.user_id),
                        sql`DATE(${AttendanceSchema.created_at}) = ${today.toISOString().slice(0, 10)}`
                    )
                )

            // Jika sudah absen, maka update absen (updated_at)
            if (existingAttendance && existingAttendance.length > 0) {
                const response = await db.update(AttendanceSchema)
                    .set({ updated_at: today })
                    .where(eq(AttendanceSchema.user_id, existingAttendance[0].user_id))
                    .returning()

                return toAttendanceResponse(response[0] as Attendance)
            }

            // Query insert data
            const response = await db.insert(AttendanceSchema).values(request).returning()
            return toAttendanceResponse(response[0] as Attendance)

        } catch (error) {
            throw error instanceof Error ? error : new Error('Unknown error occurred')
        }
    }
}