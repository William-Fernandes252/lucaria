import { GenerationError } from "@/lib/errors";
import {
  type KeywordsSchema,
  type QuestionsSchema,
  QuizGenerationResult,
  type ThemeSchema,
} from "@/schemas/generations";
import { generateObject, jsonSchema } from "ai";
import { Context, Effect, JSONSchema, Layer, Schema, pipe } from "effect";
import { System, SystemLive } from "./messages";
import { LanguageModelProvider, LanguageModelProviderLive } from "./models";

/**
 * Quiz generator
 */
export class QuizGenerator extends Context.Tag("QuizGenerator")<
  QuizGenerator,
  {
    /**
     * Generate a quiz from a theme.
     *
     * @param theme The theme for the quiz.
     * @param questions The amount of questions.
     * @returns A quiz generation effect.
     */
    generateFromTheme: (
      theme: typeof ThemeSchema.Type,
      questions: typeof QuestionsSchema.Type,
    ) => Effect.Effect<typeof QuizGenerationResult.Type, GenerationError>;

    /**
     * Generate a quiz from keywords.
     *
     * @param keywords The keywords for the quiz.
     * @param questions The amount of questions.
     * @returns A quiz generation effect.
     */
    generateFromKeywords: (
      keywords: typeof KeywordsSchema.Type,
      questions: typeof QuestionsSchema.Type,
    ) => Effect.Effect<typeof QuizGenerationResult.Type, GenerationError>;

    /**
     * Generate a quiz from a URL.
     *
     * It fetches the URL and generates a quiz from the content.
     *
     * @param url The URL to generate the quiz from.
     * @param questions The amount of questions.
     * @returns A quiz generation effect.
     */
    generateFromUrl: (
      url: URL,
      questions: typeof QuestionsSchema.Type,
    ) => Effect.Effect<typeof QuizGenerationResult.Type, GenerationError>;
  }
>() {}

/**
 * Configuration for quiz generation.
 */
const GenerationConfigLive = Layer.merge(SystemLive, LanguageModelProviderLive);

/**
 * Live quiz generator
 */
export const QuizGeneratorLive = Layer.effect(
  QuizGenerator,
  Effect.gen(function* () {
    const llmProvider = yield* LanguageModelProvider;
    const llm = yield* llmProvider.model;
    const system = yield* System;
    const systemMessage = yield* system.message;

    const decodeResult = Schema.decodeUnknownSync(QuizGenerationResult);

    const errorHandler = (error: unknown) =>
      Effect.fail(
        new GenerationError({
          message: "An error occurred during the quiz generation.",
          cause: error,
        }),
      );

    return QuizGenerator.of({
      generateFromTheme(theme, questions) {
        return pipe(
          Effect.promise(() =>
            generateObject({
              model: llm,
              schema: jsonSchema(JSONSchema.make(QuizGenerationResult)),
              system: systemMessage,
              prompt: `Generate a quiz with the theme "${theme}" with ${questions} questions.`,
            }),
          ),
          Effect.andThen(decodeResult),
          Effect.catchAll(errorHandler),
        );
      },
      generateFromKeywords(keywords, questions) {
        return pipe(
          Effect.promise(() =>
            generateObject({
              model: llm,
              schema: jsonSchema(JSONSchema.make(QuizGenerationResult)),
              system: systemMessage,
              prompt: `Generate a quiz using the keywords "${keywords.join(", ")}". with ${questions} questions.`,
            }),
          ),
          Effect.andThen(decodeResult),
          Effect.catchAll(errorHandler),
        );
      },
      generateFromUrl(url, questions) {
        return Effect.fail(
          new GenerationError({
            message: "Quiz generation from links is under development.",
          }),
        );
      },
    });
  }),
).pipe(Layer.provide(GenerationConfigLive));
