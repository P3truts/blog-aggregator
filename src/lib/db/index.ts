import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { readConfig } from "../../config";

const config = await readConfig();
const conn = postgres(config.dbConnString);
export const db = drizzle(conn, { schema });

