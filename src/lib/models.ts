import { nodeEnv } from "@/config";
import { bedrock } from "@ai-sdk/amazon-bedrock";
import type { LanguageModelV1 } from "ai";
import { Config, type ConfigError, Context, Effect, Layer } from "effect";
import { ollama } from "ollama-ai-provider";

/**
 * Language model provider.
 */
export class LanguageModelProvider extends Context.Tag("Model")<
  LanguageModelProvider,
  { model: Effect.Effect<LanguageModelV1, ConfigError.ConfigError> }
>() {}

/**
 * Live language model provider.
 */
export const LanguageModelProviderLive = Layer.effect(
  LanguageModelProvider,
  Effect.gen(function* () {
    const model = yield* Config.string("MODEL_ID");
    const environment = yield* nodeEnv;
    return {
      model: Effect.succeed(
        environment === "production" ? bedrock(model) : ollama(model),
      ),
    };
  }),
);
