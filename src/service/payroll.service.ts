import { and, gte, lte, sql } from "drizzle-orm";
import { CreatePayrollRequest, PayrollResponse } from "../model/payroll.model";
import { AttendanceSchema } from "../schema/attendance.schema";
import db from "../config/database";
import { ReimbursementSchema } from "../schema/reimbursement.schema";
import { convertToTimeZone, toTimeZoneIndonesia } from "../lib/utils";

export class PayrollService {
    static async create(request: CreatePayrollRequest): Promise<PayrollResponse> {
        try {
            const { start_date, end_date } = request;
            const now = new Date();

            // Ambil user_id dan tanggal dari attendance
            const attendances = await db
                .select({ user_id: AttendanceSchema.user_id, date: AttendanceSchema.created_at })
                .from(AttendanceSchema)
                .where(and(
                    gte(AttendanceSchema.created_at, start_date),
                    lte(AttendanceSchema.created_at, end_date)
                ));

            // Ambil user_id dan tanggal dari reimburse
            const reimbursements = await db
                .select({ user_id: ReimbursementSchema.user_id, date: ReimbursementSchema.created_at })
                .from(ReimbursementSchema)
                .where(and(
                    gte(ReimbursementSchema.created_at, start_date),
                    lte(ReimbursementSchema.created_at, end_date)
                ));

            // Gabungkan semua tanggal payroll yang mungkin
            const allCandidates = [...attendances, ...reimbursements];

            // Filter unik berdasarkan "user_id|date" sebagai key
            const uniqueMap = new Map<string, { user_id: number; payroll_date: Date }>();

            for (const item of allCandidates) {
                const dateStr = new Date(item.date).toISOString().split("T")[0]; // hanya YYYY-MM-DD
                const key = `${item.user_id}|${dateStr}`;

                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, {
                        user_id: item.user_id,
                        payroll_date: new Date(dateStr),
                    });
                }
            }

            const uniquePayrolls = Array.from(uniqueMap.values());

            if (uniquePayrolls.length === 0) {
                return {
                    message: "No payroll data found for the given date range",
                    payrolls: [],
                    created_at: convertToTimeZone(now),
                    updated_at: convertToTimeZone(now)
                };
            }

            const values = uniquePayrolls.map(item =>
                sql`(${item.user_id}, ${item.payroll_date})`
            );

            const response = await db.execute(sql`
                    insert into payrolls (user_id, payroll_date)
                    values ${sql.join(values, sql`, `)}
                    on conflict (user_id, payroll_date) do nothing
                    returning user_id, payroll_date, created_at
                `);

            const insertedPayrolls = response.rows as { user_id: number; payroll_date: Date; created_at: Date }[];
            const message = insertedPayrolls.length > 0 ? "Payroll added successfully" : "No new payroll records were added";

            return {
                message,
                payrolls: insertedPayrolls.map(p => ({
                    user_id: p.user_id,
                    date: p.payroll_date,
                    created_at: p.created_at
                })),
                created_at: convertToTimeZone(now),
                updated_at: convertToTimeZone(now)
            };

        } catch (error) {
            throw error instanceof Error ? error : new Error("Unknown error occurred")
        }
    }
}