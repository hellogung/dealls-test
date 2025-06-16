import { and, eq, sql } from "drizzle-orm";
import db from "../config/database";
import { CreateOvertimeRequest, Overtime, OvertimeResponse, toOvertimeResponse } from "../model/overtime.model";
import { OvertimeSchema } from "../schema/overtime.schema";
import { AttendanceService } from "./attendance.service";

export class OvertimeService {
    static async create(request: CreateOvertimeRequest): Promise<OvertimeResponse> {
        try {
            // Cek apakah sudah absen hari ini
            const hasAttendance = await AttendanceService.todayHasAttendance(request.user_id)
            if (!hasAttendance) throw new Error("Anda belum absen hari ini. Sebelum melakukan overtime (lembur), wajib melakukan absen terlebih dahulu")

            // Cek apakah sudah input overtime hari ini
            const today = new Date()
            const existingOvertime = await db.select().from(OvertimeSchema)
                .where(
                    and(
                        eq(OvertimeSchema.user_id, request.user_id),
                        sql`DATE(${OvertimeSchema.created_at}) = ${today.toISOString().slice(0, 10)}`
                    )
                )

            // Jika sudah maka langsung return, tampilkan text "Anda sudah input overtime hari ini"
            if (existingOvertime && existingOvertime.length > 0) {
                throw new Error("Anda sudah mengisi overtime hari ini")
            }

            if(request.hours > 3) throw new Error("Dilarang! Anda tidak boleh melebihi dari 3 jam.")

            // Query insert data
            const response = await db.insert(OvertimeSchema).values(request).returning()

            // Response
            return toOvertimeResponse(response[0] as Overtime)
        } catch (error) {
            throw error instanceof Error ? error : new Error("Unknown error occurred")
        }
    }
}