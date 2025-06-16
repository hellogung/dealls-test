import { z, ZodType } from "zod";

export class OvertimeValidator {
    static readonly CREATE: ZodType = z.object({
        user_id: z.number().positive(),
        hours: z.number().positive()
    })
}