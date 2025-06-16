import { Hono } from "hono";
import db from "../config/database";
import { userSchema } from "../schema/users.schema";
import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

const auth = new Hono()
const SECRET_KEY = process.env.SECRET_KEY

auth.post("login", async (c) => {
    const { username, password } = await c.req.json()
    const user = await db.select()
        .from(userSchema)
        .where(eq(userSchema.username, username))
        .limit(1)

    if (!user.length) return c.json({ error: "User not found" }, 404)

    const match = await Bun.password.verify(password, user[0].password)
    if (!match) return c.json({ error: "Invalid Password" }, 401)

    const payload = {
        id: user[0].id,
        role: user[0].role,
        full_name: user[0].full_name,
        username: user[0].username,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 1 hour
    }

    const token = await sign(payload, SECRET_KEY!)

    setCookie(c, "token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60,
        path: "/",
    })

    return c.json({ message: "Login successful" }, 200)

})

auth.delete("logout", async (c) => {
    setCookie(c, "token", "", {
        httpOnly: true,
        secure: false,
        path: '/',
        maxAge: 0
    })

    return c.json({ message: "Logout successful" }, 200)
})

// Hanya admin
auth.get('/admin', authMiddleware, roleMiddleware('admin'), (c) => {
    return c.json({ message: 'Hello Admin!' });
});

// Hanya employee
auth.get('/employee', authMiddleware, roleMiddleware('employee'), (c) => {
    const user = c.get("user")
    return c.json({
        message: 'Hello Employee!',
        user_id: user.id
    });
});

// Bisa admin atau employee
auth.get('/dashboard', authMiddleware, roleMiddleware(['admin', 'employee']), (c) => {
    return c.json({ message: 'Hello Dashboard for Employee or Admin!' });
});

export default auth