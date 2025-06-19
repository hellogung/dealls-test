import { and, eq, gte, lt } from "drizzle-orm";
import db from "../config/database";
import { GetPayslipRequest, PayslipResponse, toPayslipResponse } from "../model/payslip.model";
import { AttendanceSchema } from "../schema/attendance.schema";
import { OvertimeSchema } from "../schema/overtime.schema";
import { ReimbursementSchema } from "../schema/reimbursement.schema";

export class PayslipService {
    static async get(request: GetPayslipRequest): Promise<PayslipResponse> {
        try {
            const { user_id, month, salary } = request

            // Buat rentang awal dan akhir bulan
            const startDate = new Date(`${month}-01T00:00:00.000Z`);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            const [attendanceData, overtimesData, reimbursesData] = await Promise.all([
                db.select().from(AttendanceSchema).where(
                    and(
                        eq(AttendanceSchema.user_id, user_id),
                        gte(AttendanceSchema.created_at, startDate),
                        lt(AttendanceSchema.created_at, endDate),
                    )
                ),
                db.select().from(OvertimeSchema).where(
                    and(
                        eq(OvertimeSchema.user_id, user_id),
                        gte(OvertimeSchema.created_at, startDate),
                        lt(OvertimeSchema.created_at, endDate),
                    )
                ),
                db.select().from(ReimbursementSchema).where(
                    and(
                        eq(ReimbursementSchema.user_id, user_id),
                        gte(ReimbursementSchema.created_at, startDate),
                        lt(ReimbursementSchema.created_at, endDate),
                    )
                ),
            ])

            const attendances = attendanceData.map(attendance => ({
                date: attendance.created_at,
                salary: salary,
            }))

            const overtimes = overtimesData.map(overtime => ({
                date: overtime.created_at,
            }))
            return {
                message: "Payslip details retrieved successfully",
                user_id: 1,
                salary: salary,
                attendances: attendanceData.map(attendance => ({
                    date: attendance.created_at,
                    salary: salary,
                })),
                overtimes: overtimesData.map(overtime => ({
                    date: overtime.created_at,
                    overtime_hours: overtime.hours,
                    salary: 0,
                })),
                reimburses: reimbursesData.map(reimburse => ({
                    date: reimburse.created_at,
                    amount: reimburse.amount,
                    description: reimburse.description,
                })),
                total_take_home_pay: 5000000
            }

            // return toPayslipResponse({
            //     user_id: user_id,
            //     attendances: attendanceData,
            //     overtimes: overtimesData,
            //     reimburses: reimbursesData,
            //     total_take_home_pay: salary
            // })
        } catch (error) {
            throw error instanceof Error ? error : new Error("Unknown error occurred")
        }
    }
}