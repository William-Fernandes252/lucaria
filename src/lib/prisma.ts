import { PrismaClient } from "@prisma/client";
import { Config, type ConfigError, Context, Effect, Layer } from "effect";

/**
 * Prisma client provider.
 */
export class PrismaClientProvider extends Context.Tag("Prisma")<
  PrismaClientProvider,
  () => Effect.Effect<PrismaClient, ConfigError.ConfigError>
>() {}

/**
 * Live Prisma client provider.
 */
export const PrismaClientProviderLive = Layer.effect(
  PrismaClientProvider,
  Effect.gen(function* () {
    const log = yield* Config.literal("development", "production")("NODE_ENV");
    const client = new PrismaClient({
      log: log === "development" ? ["query"] : [],
    });
    return () => Effect.succeed(client);
  }),
);
