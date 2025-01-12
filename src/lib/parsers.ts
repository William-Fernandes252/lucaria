import { Context, Effect, Layer } from "effect";
import { z } from "zod";

/**
 * Count the number of words in a text.
 */
export class WordCounter extends Context.Tag("WordCounter")<
  WordCounter,
  {
    count: (text: string) => Effect.Effect<number>;
  }
>() {}

/**
 * Live word counter.
 */
export const WordCounterLive = Layer.succeed(WordCounter, {
  count: (text: string) =>
    Effect.succeed(
      text
        .trim()
        .split(/s+/)
        .filter((word) => word.length).length,
    ),
});

/**
 * Checks if a given text represents a valid URL.
 */
export class URLValidator extends Context.Tag("URLValidator")<
  URLValidator,
  {
    validate: (text: string) => Effect.Effect<boolean>;
  }
>() {}

/**
 * Live URL validator.
 */
export const URLValidatorLive = Layer.succeed(URLValidator, {
  validate: (text: string) =>
    Effect.succeed(z.string().url().safeParse(text).success),
});
