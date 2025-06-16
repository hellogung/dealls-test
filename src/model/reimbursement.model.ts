import { convertToTimeZone } from "../lib/utils"
import { ReimbursementSchema } from "../schema/reimbursement.schema"

export type CreateReimbursementRequest = {
    user_id: number,
    amount: number,
    description: string
}

export type ReimbursementResponse = {
    message: string,
    user_id: number,
    amout: number,
    description: string
    created_at: Date,
    updated_at: Date,
}

export type Reimbursement = typeof ReimbursementSchema.$inferSelect

export function toReimbursementResponse(data: Reimbursement): ReimbursementResponse {
    return {
        message: "Reimburse added successfully",
        user_id: data.user_id,
        amout: data.amount,
        description: data.description,
        created_at: convertToTimeZone(data.created_at),
        updated_at: convertToTimeZone(data.updated_at)
    }
}