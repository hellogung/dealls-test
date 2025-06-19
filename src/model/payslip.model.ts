import { countWeekdaysInCurrentMonth } from "../lib/utils"
import overtime from "../route/overtime.route"

export type GetPayslipRequest = {
    user_id: number,
    salary: number | bigint,
    month: string, // YYYY-MM
}

export type PayslipRequest = {
    user_id: number,
    attendances: ListAttendanceAffectedWithSalary[],
    overtimes: ListOvertimeAffectedWithSalary[],
    reimburses: ListReimburses[],
    total_take_home_pay: number | bigint
}

// type PayslipRequestDTO = PayslipResponse
export type PayslipResponse = PayslipRequest & {
    message: string;
    salary: number | bigint
}

type ListAttendanceAffectedWithSalary = {
    date: Date,
    salary: number | bigint
}

type ListOvertimeAffectedWithSalary = {
    date: Date,
    overtime_hours: number,
    salary: number | bigint
}

type ListReimburses = {
    amount: number | bigint,
    description: string
}

export function toPayslipResponse(data: PayslipResponse, salary: number | bigint = 5_000_000): PayslipResponse {
    const count_days_in_this_month: number = countWeekdaysInCurrentMonth()
    const salary_per_day: number = Number(salary) / count_days_in_this_month
    const salary_per_hours: number = salary_per_day / 8
    const overtime_per_hours: number = salary_per_hours * 2

    // Total salary of attendances = sum of weekday multiplied with salary of employee
    const salary_of_attendance = data.attendances.reduce((total, attendance) => {
        return total + salary_per_day
    }, 0)

    // Total salary of overtime = sum of overtimes multiplied with twice of salary per hours
    const salary_of_overtime = data.overtimes.reduce((total, overtime: ListOvertimeAffectedWithSalary) => {
        return total + (overtime_per_hours * overtime.overtime_hours)
    }, 0)

    // Salary reimburses = sum of amount reimburses
    const salary_of_reimburse = data.reimburses.reduce((total, r: ListReimburses) => {
        return total + Number(r.amount)
    }, 0)
    const total_take_home_pay = salary_of_attendance + salary_of_overtime + salary_of_reimburse

    return {
        message: "Detail Payslip",
        salary: data.salary,
        user_id: data.user_id,
        attendances: data.attendances.map((item: ListAttendanceAffectedWithSalary) => (
            {
                date: item.date,
                salary: salary_per_day
            }
        )),
        overtimes: data.overtimes.map((item: ListOvertimeAffectedWithSalary) => ({
            date: item.date,
            overtime_hours: item.overtime_hours,
            salary: item.salary
        })),
        reimburses: data.reimburses.map((item: ListReimburses) => ({
            amount: item.amount,
            description: item.description
        })),
        total_take_home_pay
    }
}


// ! ERROR