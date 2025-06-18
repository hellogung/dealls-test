import { Context, Next } from "hono";
import { and, eq, sql } from "drizzle-orm";
import db from "../config/database";
import { PayrollSchema } from "../schema/payroll.schema";

export const checkPayrollFinalization = async (c: Context, next: Next) => {
    try {
        const today = new Date();
        const todayISO = today.toISOString().slice(0, 10);

        const userId = (c.get("user") as { id: number }).id

        if (!userId) {
            return c.json({
                message: "User ID is required",
                status: "error"
            }, 400);
        }

        // Check if today's date is already in payroll
        const isPayrollFinalized = await db.select()
            .from(PayrollSchema)
            .where(
                and(
                    eq(PayrollSchema.user_id, userId),
                    sql`DATE(${PayrollSchema.payroll_date}) = ${todayISO}::date`
                )
            );

        if (isPayrollFinalized.length > 0) {
            return c.json({
                message: "This date has been finalized in payroll. You cannot add or modify records.",
                status: "error",
                is_finalized: true,
                date: todayISO,
                user_id: userId
            }, 403);
        }

        await next();
    } catch (error) {
        return c.json({
            message: error instanceof Error ? error.message : "An error occurred while checking payroll status",
            status: "error"
        }, 500);
    }
}; 