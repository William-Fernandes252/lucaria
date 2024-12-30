import { Context, Effect, Layer } from "effect";

/**
 * System message to guide the model behavior.
 */
export class System extends Context.Tag("System")<
  System,
  {
    message: Effect.Effect<string>;
  }
>() {}

/**
 * Live system message.
 */
export const SystemLive = Layer.succeed(System, {
  message: Effect.succeed("You are a quiz generator."),
});
