import { MiddlewareHandler } from "hono"
import { getCookie } from "hono/cookie"
import { verify } from "hono/jwt"

const SECRET_KEY = process.env.SECRET_KEY

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const token = getCookie(c, "token")
    if (!token) return c.json({ error: "Unauthorized" }, 401)

    try {
        const decoded = verify(token, SECRET_KEY!)
        c.set("user", decoded)
        await next()
    } catch (error) {
        return c.json({ error: "Invalid token" }, 401)
    }
}

export const roleMiddleware = (roles: "admin" | "employee" | Array<'admin' | 'employee'>): MiddlewareHandler => {
    return async (c, next) => {
        const user = await c.get("user") as { role: "admin" | "employee" }

        const roleList = Array.isArray(roles) ? roles : [roles]

        if (!roleList.includes(user.role)) return c.json({ error: "Forbidden: insufficient role" }, 403)
        await next()
    }
}