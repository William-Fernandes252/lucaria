import { GenerationError } from "@/lib/errors";
import {
  type KeywordsType,
  type QuestionsType,
  QuizGenerationResultSchema,
  type QuizGenerationResultType,
  type ThemeType,
  type URLType,
} from "@/schemas/generations";
import { generateObject } from "ai";
import { Context, Effect, Layer, pipe } from "effect";
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
      theme: ThemeType,
      questions: QuestionsType,
    ) => Effect.Effect<QuizGenerationResultType, GenerationError>;

    /**
     * Generate a quiz from keywords.
     *
     * @param keywords The keywords for the quiz.
     * @param questions The amount of questions.
     * @returns A quiz generation effect.
     */
    generateFromKeywords: (
      keywords: KeywordsType,
      questions: QuestionsType,
    ) => Effect.Effect<QuizGenerationResultType, GenerationError>;

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
      url: URLType,
      questions: QuestionsType,
    ) => Effect.Effect<QuizGenerationResultType, GenerationError>;
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

    function generateForPrompt(prompt: string) {
      return pipe(
        Effect.promise(() =>
          generateObject({
            model: llm,
            schema: QuizGenerationResultSchema,
            system: systemMessage,
            prompt,
          }),
        ),
        Effect.andThen((result) => result.object),
        Effect.andThen(
          QuizGenerationResultSchema.parse.bind(QuizGenerationResultSchema),
        ),
        Effect.catchAll((error: unknown) =>
          Effect.fail(
            new GenerationError({
              message: "An error occurred during the quiz generation.",
              cause: error,
            }),
          ),
        ),
      );
    }

    return QuizGenerator.of({
      generateFromTheme(theme, questions) {
        return generateForPrompt(
          `Generate a quiz using the theme "${theme}". with ${questions} questions.`,
        );
      },
      generateFromKeywords(keywords, questions) {
        return generateForPrompt(
          `Generate a quiz using the keywords "${keywords}". with ${questions} questions.`,
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
