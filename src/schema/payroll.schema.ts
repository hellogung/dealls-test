import { date, integer, pgTable, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { userSchema } from "./users.schema";

export const PayrollSchema = pgTable("payrolls", {
    id: serial().primaryKey(),
    user_id: integer().notNull().references(() => userSchema.id),
    payroll_date: date().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull()
}, (table) => ({
    uniqueUserDate: unique().on(table.user_id, table.payroll_date)
}))