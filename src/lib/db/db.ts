import { env } from "@/env";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { clients } from "./schema/client";
import { invoices, invoicesRelations } from "./schema/invoice";
import { organizations } from "./schema/organization";

const turso = createClient({
  authToken: env.TURSO_AUTH_TOKEN,
  url: env.TURSO_DATABASE_URL,
});

export const db = drizzle(turso, {
  schema: { clients, invoices, invoicesRelations, organizations },
});
