import { Hono } from "hono";
import attendance from "./attendance.route";
import auth from "./auth.route";
import overtime from "./overtime.route";
import reimbursement from "./reimbursement.route";

const api = new Hono().basePath("/api");

api.route("attendance", attendance)
api.route("reimbursement", reimbursement)
api.route("overtime", overtime)
api.route("auth", auth)

export default api;