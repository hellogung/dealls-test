import { Hono } from "hono";
import { Attendance } from "../model/attendance.model";

const attendance = new Hono()

attendance
    .get(c => {
        return c.text("Attendance API is working!");
    })
    .post(async (c) => {
        const user_id = c.req.param('user_id');
        if (!user_id) {
            return c.json({ error: "User ID is required" }, 400);
        }

        const response = await AttendanceService.create(user_id)
        // return c.json(data: response);
    })

export default attendance;