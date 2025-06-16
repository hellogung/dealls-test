import { z, ZodType } from "zod";

export class ReimbursementValidator {
    static readonly CREATE: ZodType = z.object({
        user_id: z.number().positive(),
        amount: z.bigint().positive(),
        description: z.string()
    })
}