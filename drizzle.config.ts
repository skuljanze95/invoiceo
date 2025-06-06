import type { Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  dbCredentials: {
    authToken: env.TURSO_AUTH_TOKEN,
    url: env.TURSO_DATABASE_URL,
  },
  dialect: "turso",
  out: "./drizzle/migrations",
  schema: "./src/lib/db/schema/*.ts",
  strict: true,
  verbose: true,
} satisfies Config;
