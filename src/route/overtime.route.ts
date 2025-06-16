import { Hono } from "hono";
import { OvertimeValidator } from "../validator/overtime.validator";
import { ZodError } from "zod";
import { OvertimeService } from "../service/overtime.service";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const overtime = new Hono()

overtime
    .post(authMiddleware, roleMiddleware("employee"), async (c) => {
        const user = c.get("user") as { id: number }
        const body = await c.req.json()
        const request = {
            user_id: user.id,
            ...body
        }

        try {
            const validate = OvertimeValidator.CREATE.parse(request)

            const response = await OvertimeService.create(validate)

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

export default overtime