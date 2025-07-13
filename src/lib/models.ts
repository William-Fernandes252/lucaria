import { bedrock } from "@ai-sdk/amazon-bedrock";
import type { LanguageModelV1 } from "ai";
import { Config, type ConfigError, Context, Effect, Layer } from "effect";
import { ollama } from "ollama-ai-provider";

/**
 * Language model provider.
 */
export class LanguageModelProvider extends Context.Tag("Model")<
  LanguageModelProvider,
  () => Effect.Effect<LanguageModelV1, ConfigError.ConfigError>
>() {}

/**
 * Bedrock language model provider.
 *
 * This provider uses the Amazon Bedrock service to provide language models.
 * The model ID is configured through the environment variable `MODEL_ID` (with no default).
 */
export const Bedrock = Layer.effect(
  LanguageModelProvider,
  Effect.gen(function* () {
    const model = yield* Config.string("MODEL_ID");
    return () => Effect.succeed(bedrock(model));
  }),
);

/**
 * Ollama language model provider.
 * 
 * This provider uses the Ollama service to provide language models.
 * The model ID is configured through the environment variable `MODEL_ID` (defaulting to "mistral").
 * This provider is useful for local development and testing with Ollama models.

 * Note: Ensure that the Ollama service is running and accessible locally.
 * The model ID should correspond to a valid model available in the Ollama service.
 * 
 * @see https://ollama.com for more information on available models and usage.
 */
export const Ollama = Layer.effect(
  LanguageModelProvider,
  Effect.gen(function* () {
    const model = yield* Config.string("MODEL_ID").pipe(
      Config.withDefault("mistral"),
    );
    return () => Effect.succeed(ollama(model));
  }),
);
