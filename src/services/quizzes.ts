import { GenerationError } from "@/lib/errors";
import { generateObject } from "ai";
import { Context, Effect, Layer, pipe } from "effect";
import { z } from "zod";
import {
  type Input,
  MessageBuilder,
  MessageBuilderLive,
  System,
  SystemLive,
} from "../lib/messages";
import {
  LanguageModelProvider,
  LanguageModelProviderLive,
} from "../lib/models";

/**
 * Schema for quiz generation result.
 */
export const QuizGenerationResultSchema = z
  .object({
    title: z.string().describe("The title of the quiz."),
    questions: z
      .array(
        z.object({
          question: z.string().describe("The question."),
          options: z.array(z.string()).describe("The possible answers."),
          correct: z
            .number()
            .int()
            .describe("The index of the correct answer."),
        }),
      )
      .describe("The questions in the quiz."),
  })
  .describe("Schema for quiz generation result.");

export type QuizGenerationResult = z.infer<typeof QuizGenerationResultSchema>;

/**
 * Quiz generator
 */
export class QuizService extends Context.Tag("QuizService")<
  QuizService,
  {
    /**
     * Generate a quiz from an user input.
     *
     * @param input The user input.
     * @returns A quiz generation effect.
     */
    generateQuiz: (
      input: Input,
    ) => Effect.Effect<QuizGenerationResult, GenerationError>;
  }
>() {}

/**
 * Configuration for quiz generation.
 */
const GenerationConfigLive = Layer.mergeAll(
  LanguageModelProviderLive,
  SystemLive,
  MessageBuilderLive,
);

/**
 * Live quiz generator
 */
export const QuizServiceLive = Layer.effect(
  QuizService,
  Effect.gen(function* () {
    const llmProvider = yield* LanguageModelProvider;
    const llm = yield* llmProvider.model;
    const system = yield* System;
    const systemMessage = yield* system.message;
    const messageBuilder = yield* MessageBuilder;
    return QuizService.of({
      generateQuiz(input) {
        return pipe(
          messageBuilder.buildForInput(input),
          Effect.andThen((messages) =>
            generateObject({
              model: llm,
              schema: QuizGenerationResultSchema,
              system: systemMessage,
              messages,
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
      },
    });
  }),
).pipe(Layer.provide(GenerationConfigLive));
