import { z, ZodType } from "zod";

export class AttendanceValidator {
    static readonly CREATE: ZodType = z.object({
        user_id: z.number().positive()
    })
}