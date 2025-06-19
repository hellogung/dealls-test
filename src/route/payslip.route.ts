import { Hono } from "hono";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";
import { GetPayslipRequest } from "../model/payslip.model";
import { PayslipValidator } from "../validator/payslip.validator";
import { PayslipService } from "../service/payslip.service";
import { ZodError } from "zod";

const payslip = new Hono()

payslip
    .post(authMiddleware, roleMiddleware("employee"), async (c) => {
        const user = c.get("user") as { id: number, salary: number | bigint }
        const body = await c.req.json() as { month: string }

        const request: GetPayslipRequest = {
            user_id: user.id,
            salary: user.salary,
            ...body
        }

        try {
            const validate = PayslipValidator.GET.parse(request)

            const response = await PayslipService.get(validate)

            return c.json({ data: response })
        } catch (error) {
            if (error instanceof ZodError) {
                return c.json({
                    error: "Validation failed",
                    details: error.errors,
                }, 400);
            }

            return c.json({
                error: "Internal Server Error",
                message: error instanceof Error ? error.message : "Unknown error"
            }, 500);
        }
    })

export default payslip