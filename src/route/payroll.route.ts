import { Hono } from "hono";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";
import { PayrollValidator } from "../validator/payroll.validator";
import { ZodError } from "zod";
import { CreatePayrollRequest } from "../model/payroll.model";
import { PayrollService } from "../service/payroll.service";

const payroll = new Hono()

payroll
    .post(authMiddleware, roleMiddleware("admin"), async (c) => {
        const body = await c.req.json() as CreatePayrollRequest
        const request: CreatePayrollRequest = {
            start_date: new Date(body.start_date),
            end_date: new Date(body.end_date)
        }

        try {
            const validate = PayrollValidator.CREATE.parse(request)

            const response = await PayrollService.create(validate)

            return c.json({ data: response })
        }
        catch (error) {
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

export default payroll