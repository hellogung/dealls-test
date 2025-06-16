import { Hono } from "hono";
import attendance from "./attendance.route";
import auth from "./auth.route";

const api = new Hono().basePath("/api");

api.route("attendance", attendance)
api.route("auth", auth)

export default api;