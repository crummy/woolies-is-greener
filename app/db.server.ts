import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema });

// Run migrations
migrate(db, { migrationsFolder: "./migrations" });
