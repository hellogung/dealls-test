import { MiddlewareHandler } from "hono"
import { getCookie } from "hono/cookie"
import { verify } from "hono/jwt"

const SECRET_KEY = process.env.SECRET_KEY

type UserPayload = {
    id: number
    full_name: string
    username: string
    role: "admin" | "employee"
}

export const authMiddleware: MiddlewareHandler<{ Variables: { user: UserPayload } }> = async (c, next) => {
    const token = getCookie(c, "token")
    if (!token) return c.json({ error: "Unauthorized" }, 401)

    try {
        const decoded = await verify(token, SECRET_KEY!) as UserPayload
        c.set("user", decoded)
        await next()
    } catch (error) {
        return c.json({ error: "Invalid token" }, 401)
    }
}

export const roleMiddleware = (roles: "admin" | "employee" | Array<'admin' | 'employee'>): MiddlewareHandler<{ Variables: { user: UserPayload } }> => {
    return async (c, next) => {
        const user = c.get("user") as { role: "admin" | "employee" }

        const roleList = Array.isArray(roles) ? roles : [roles]

        if (!roleList.includes(user.role)) return c.json({ error: "Forbidden: insufficient role" }, 403)
        await next()
    }
}