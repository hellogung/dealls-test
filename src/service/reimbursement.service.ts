import db from "../config/database";
import { CreateReimbursementRequest, Reimbursement, ReimbursementResponse, toReimbursementResponse } from "../model/reimbursement.model";
import { ReimbursementSchema } from "../schema/reimbursement.schema";

export class ReimbursementService {
    static async create(request: CreateReimbursementRequest): Promise<ReimbursementResponse> {
        try {
            // Query insert data
            const response = await db.insert(ReimbursementSchema).values(request).returning()

            // Response
            return toReimbursementResponse(response[0] as Reimbursement)
        } catch (error) {
            throw error instanceof Error ? error : new Error("Unknown error occurred")
        }
    }
}