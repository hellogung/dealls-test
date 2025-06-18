import { Hono } from "hono";
import { AttendanceService } from "../service/attendance.service";
import { AttendanceValidator } from "../validator/attendance.validator";
import { ZodError } from "zod";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";
import { CreateAttendanceRequest } from "../model/attendance.model";
import { checkPayrollFinalization } from "../middleware/payroll.middleware";

const attendance = new Hono();

attendance
    .post(authMiddleware, roleMiddleware("employee"), checkPayrollFinalization, async (c) => {
        try {
            const user = c.get("user") as { id: number }

            const request: CreateAttendanceRequest = {
                user_id: user.id
            }

            const validate = AttendanceValidator.CREATE.parse(request)

            const response = await AttendanceService.create(validate)
            return c.json({ data: response });

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

export default attendance;