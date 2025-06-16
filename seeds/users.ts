import { reset, seed } from "drizzle-seed";
import { userSchema } from "../src/schema/users.schema";
import db from "../src/config/database";

async function add() {
    const data = 100

    const password = await Bun.password.hash("password", { algorithm: "bcrypt" })

    await reset(db, { userSchema })

    await db.insert(userSchema).values([{
        id: 0,
        full_name: "Agung Gumelar",
        username: "gunghello@gmail.com",
        password: password,
        gaji: BigInt(10_000_000),
        role: "admin"
    }])

    await seed(db, { users: userSchema }).refine(f => ({
        users: {
            columns: {
                full_name: f.fullName(),
                username: f.email(),
                password: f.default({ defaultValue: password }),
                gaji: f.valuesFromArray({ values: [5_000_000, 5_500_000, 6_000_000, 6_500_000, 7_000_000, 7_500_000, 8_000_000, 8_500_000, 9_000_000, 9_500_000, 10_000_000] }),
                role: f.default({ defaultValue: "employee" }),
            },
            count: data
        }
    }))

    await db.update(userSchema).set({
        created_at: new Date(),
        updated_at: new Date()
    })

    console.log(`Seeded users ${data} rows completed`)
}

add()