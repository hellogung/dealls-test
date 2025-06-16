import { Hono } from 'hono'
import api from './route/index.route'

const app = new Hono()

app.route("/", api)

app.get("/", (c) => {
  return c.text("Welcome 👋")
})

app.notFound((c) => {
  return c.text('404 Not Found', 404)
})

export default app
