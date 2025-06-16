import { Hono } from "hono";
import { Attendance } from "../model/attendance.model";
import { AttendanceService } from "../service/attendance.service";
import { AttendanceValidator } from "../validator/attendance.validator";
import { ZodError } from "zod";

const attendance = new Hono()

attendance
    .get(c => {
        return c.text("Attendance API is working!");
    })
    .post(async (c) => {
        try {
            const request = await c.req.json()

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
            }, 409);
        }

    })

export default attendance;