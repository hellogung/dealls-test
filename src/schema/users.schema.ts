import { bigint, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { AttendanceSchema } from "./attendance.schema";

export const roleEnum = pgEnum("role", ["admin", "employee"])

export const userSchema = pgTable("users", {
    id: serial().primaryKey(),
    full_name: varchar({ length: 255 }).notNull(),
    username: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    gaji: bigint({ mode: "bigint" }).notNull(),
    role: roleEnum().notNull().default("employee"),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull()
})

// export const userRelations = relations(userSchema, ({ many }) => ({
//     attendances: many(AttendanceSchema)
// }));