import { and, eq, sql } from "drizzle-orm";
import db from "../config/database";
import { Attendance, AttendanceResponse, CreateAttendanceRequest, toAttendanceResponse } from "../model/attendance.model";
import { AttendanceSchema } from "../schema/attendance.schema";

export class AttendanceService {
    static async create(request: CreateAttendanceRequest): Promise<AttendanceResponse> {
        try {
            const today = new Date()

            // Cek apakah sudah pernah absen hari ini
            const hasAttendance = await this.todayHasAttendance(request.user_id)

            // Jika sudah absen, maka update absen (updated_at)
            if (hasAttendance) {
                const response = await db.update(AttendanceSchema)
                    .set({ updated_at: today })
                    .where(eq(AttendanceSchema.id, hasAttendance.id))
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

    static async todayHasAttendance(user_id: number): Promise<Attendance | null> {
        // Cek apakah hari ini hari weekend (sabtu atau minggu)
        const today = new Date()
        const isWeekend = today.getDay() === 0 || today.getDay() === 6

        if (isWeekend) {
            throw new Error("Hari ini adalah hari weekend, tidak dapat absen")
        }

        const response = await db
            .select()
            .from(AttendanceSchema)
            .where(
                and(
                    eq(AttendanceSchema.user_id, user_id),
                    sql`DATE(${AttendanceSchema.created_at}) = ${today.toISOString().slice(0, 10)}`
                )
            )

        return response[0] ?? null


    }
}