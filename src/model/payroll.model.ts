import { convertToTimeZone } from "../lib/utils";
import { PayrollSchema } from "../schema/payroll.schema";

export type CreatePayrollRequest = {
    start_date: Date,
    end_date: Date
}

export type PayrollResponse = {
    message: string,
    payrolls: ListPayroll[]
    created_at: Date,
    updated_at: Date,
}

type ListPayroll = {
    user_id: number,
    date: Date
}

export type Payroll = typeof PayrollSchema.$inferSelect

export function toPayrollResponse(data: Payroll[]): PayrollResponse {
    return {
        message: "Payroll added successfully",
        payrolls: data.map(item => ({
            user_id: item.user_id,
            date: new Date(item.payroll_date)
        })),
        created_at: convertToTimeZone(new Date()),
        updated_at: convertToTimeZone(new Date())
    }
}