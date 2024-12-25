import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  AUTH_SECRET: z.string(),
});

const result = schema.safeParse(process.env);
if (result.success === false) {
  console.error("Invalid environment variables: ", result.error);
  process.exit(1);
}

export const config = result.data;
