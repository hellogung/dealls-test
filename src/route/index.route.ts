import { Hono } from "hono";
import attendance from "./attendance.route";

const api = new Hono().basePath("/api");

api.route("attendance", attendance)

export default api;