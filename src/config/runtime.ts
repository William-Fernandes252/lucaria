import { Config } from "effect";

/**
 * Node environment configuration.
 */
export const nodeEnv = Config.literal(
  "development",
  "production",
  "test",
)("NODE_ENV");
