import { sql } from "drizzle-orm";

async function createUpdatedAtTriggers(
    db: any, // Drizzle client
    tables: string[]
  ) {
    const tablesArrayString = '{' + tables.map(t => `"${t}"`).join(",") + '}';
    // Panggil function di DB
    await db.execute(sql`
      SELECT create_updated_at_triggers(${tablesArrayString}::text[])
    `);
  }

async function createUpdateUpdatedAtFunction(db: any) {
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);
}


export async function setupUpdatedAtTriggers(db: any, tables: string[]) {
    await createUpdateUpdatedAtFunction(db);
    await createUpdatedAtTriggers(db, tables);
  }