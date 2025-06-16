import db from "../config/database";
import { AttendanceResponse, CreateAttendanceRequest, toAttendanceResponse } from "../model/attendance.model";
import { AttendanceSchema } from "../schema/attendance.schema";
import { AttendanceValidator } from "../validator/attendance.validator";

export class AttendanceSerice {
    static async create(request: CreateAttendanceRequest): Promise<AttendanceResponse> {
        request = AttendanceValidator.CREATE.parse(request)

        const response = await db.insert(AttendanceSchema).values(request)

        return toAttendanceResponse(response)
    }
}