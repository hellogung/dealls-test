import { z, ZodType } from "zod";

export class PayrollValidator {
    static readonly CREATE: ZodType = z.object({
        start_date: z.date(),
        end_date: z.date()
    })
}