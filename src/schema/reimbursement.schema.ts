import { bigint, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { userSchema } from "./users.schema";

export const ReimbursementSchema = pgTable("reimbursements", {
    id: serial().primaryKey(),
    user_id: integer().notNull().references(() => userSchema.id),
    amount: integer().notNull(),
    description: varchar().notNull(),
    created_at: timestamp({withTimezone: true}).defaultNow().notNull(),
    updated_at: timestamp({withTimezone: true}).defaultNow().notNull()
})