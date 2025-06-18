import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { userSchema } from "./users.schema";

export const OvertimeSchema = pgTable("overtimes", {
    id: serial().primaryKey(),
    user_id: integer().notNull().references(() => userSchema.id),
    hours: integer().notNull(),
    created_at: timestamp({withTimezone: true}).defaultNow().notNull(),
    updated_at: timestamp({withTimezone: true}).defaultNow().notNull()
})