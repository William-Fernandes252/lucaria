import { bedrock } from "@ai-sdk/amazon-bedrock";
import type { LanguageModelV1 } from "ai";
import { Config, type ConfigError, Context, Effect, Layer } from "effect";

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
    const model = yield* Config.literal(
      "anthropic.claude-3-5-sonnet-20240620-v1:0",
    )("BEDROCK_MODEL_ID");
    return {
      model: Effect.succeed(
        bedrock("anthropic.claude-3-5-sonnet-20240620-v1:0"),
      ),
    };
  }),
);
