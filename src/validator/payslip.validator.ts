import { z, ZodType } from "zod";

export class PayslipValidator {
    static readonly GET: ZodType = z.object({
        user_id: z.number().positive(),
        month: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])$/, {
            message: "Month must be in yyyy-mm format (e.g. 2024-03)"
        }),
        salary: z.number().positive()
    });
}