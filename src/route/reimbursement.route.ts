import { Hono } from "hono";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";
import { ReimbursementValidator } from "../validator/reimbursement.validator";
import { ReimbursementService } from "../service/reimbursement.service";
import { ZodError } from "zod";
import { CreateReimbursementRequest } from "../model/reimbursement.model";
import { checkPayrollFinalization } from "../middleware/payroll.middleware";

const reimbursement = new Hono

reimbursement.post(authMiddleware, roleMiddleware("employee"), checkPayrollFinalization, async (c) => {
    const user = c.get("user") as { id: number }
    const body = await c.req.json() as { amount: number, description: string }
    const request: CreateReimbursementRequest = {
        user_id: user.id,
        ...body,
    }

    try {
        const validate = ReimbursementValidator.CREATE.parse(request)

        const response = await ReimbursementService.create(validate)

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

export default reimbursement