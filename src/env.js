import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,

  runtimeEnv: {
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NODE_ENV: process.env.NODE_ENV,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
  },

  server: {
    APP_URL: z.string({
      required_error: "Missing env variable: NEXT_PUBLIC_APP_URL ",
    }),
    CLERK_PUBLISHABLE_KEY: z.string({
      required_error: "Missing env variable: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    }),
    CLERK_SECRET_KEY: z.string({
      required_error: "Missing env variable: CLERK_SECRET_KEY",
    }),
    CLERK_SIGN_IN_URL: z.string({
      required_error: "Missing env variable: NEXT_PUBLIC_CLERK_SIGN_IN_URL",
    }),
    CLERK_SIGN_UP_URL: z.string({
      required_error: "Missing env variable: NEXT_PUBLIC_CLERK_SIGN_UP_URL",
    }),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    RESEND_API_KEY: z.string({
      required_error: "Missing env variable: RESEND_API_KEY",
    }),
    TURSO_AUTH_TOKEN:
      process.env.NODE_ENV === "production"
        ? z.string({
            required_error: "Missing env variable: TURSO_AUTH_TOKEN",
          })
        : z.string().optional(),
    TURSO_DATABASE_URL: z.string({
      required_error: "Missing env variable: TURSO_DATABASE_URL",
    }),
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
