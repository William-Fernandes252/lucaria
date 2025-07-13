import { GenerationError } from "@/lib/errors";
import {
  type Input,
  MessageBuilder,
  MessageBuilderLive,
  System,
  SystemLive,
} from "@/lib/messages";
import { Bedrock, LanguageModelProvider } from "@/lib/models";
import {
  type CreateQuizSchemaType,
  PrismaQuizRepository,
  type Quiz,
  QuizRepository,
} from "@/repositories/quizzes";
import { generateObject } from "ai";
import { Context, Effect, Layer, pipe } from "effect";
import { z } from "zod";

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
    generateQuiz: (input: Input) => Effect.Effect<Quiz, GenerationError>;

    /**
     * Create a quiz.
     *
     * @param data The data to create the quiz.
     * @returns An effect that creates a quiz.
     */
    createQuiz: (data: CreateQuizSchemaType) => Effect.Effect<Quiz>;
  }
>() {}

/**
 * Configuration for quiz generation.
 */
const GenerationConfigLive = Layer.mergeAll(
  Bedrock,
  SystemLive,
  MessageBuilderLive,
  PrismaQuizRepository,
);

/**
 * Live quiz generator
 */
export const QuizServiceLive = Layer.effect(
  QuizService,
  Effect.gen(function* () {
    const llm = yield* (yield* LanguageModelProvider)();
    const system = yield* (yield* System).message;
    const messageBuilder = yield* MessageBuilder;
    const quizRepository = yield* QuizRepository;
    return QuizService.of({
      createQuiz(data) {
        return quizRepository.createQuiz(data);
      },
      generateQuiz(input) {
        return pipe(
          messageBuilder.buildForInput(input),
          Effect.andThen((messages) =>
            generateObject({
              model: llm,
              schema: QuizGenerationResultSchema,
              system,
              messages,
            }),
          ),
          Effect.andThen((result) => result.object),
          Effect.andThen(
            QuizGenerationResultSchema.parse.bind(QuizGenerationResultSchema),
          ),
          Effect.andThen(({ title, questions }) =>
            this.createQuiz({
              title,
              questions: questions.map(
                ({ question, options, correct }, index) => ({
                  sequence: index,
                  enunciation: question,
                  options: options.map((option, index) => ({
                    enunciation: option,
                    correct: index === correct,
                  })),
                }),
              ),
            }),
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
