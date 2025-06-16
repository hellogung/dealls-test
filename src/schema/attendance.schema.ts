import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userSchema } from "./users.schema";

export const AttendanceSchema = pgTable("attendances", {
    id: serial().primaryKey(),
    user_id: integer().notNull().references(() => userSchema.id),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true }).defaultNow().notNull()
})

// export const attendanceRelations = relations(AttendanceSchema, ({ one }) => ({
//     user: one(userSchema, {
//         fields: [AttendanceSchema.user_id],
//         references: [userSchema.id],
//     }),
// }));