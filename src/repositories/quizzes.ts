import { PrismaClientProvider, PrismaClientProviderLive } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { Context, Effect, Layer } from "effect";
import type { User } from "next-auth";
import { z } from "zod";

export type Quiz = Prisma.QuizGetPayload<{
  include: {
    questions: {
      include: {
        options: true;
      };
    };
  };
}>;

export type Question = Prisma.QuestionGetPayload<{
  include: {
    options: true;
  };
}>;

export type Option = Prisma.OptionGetPayload<{
  include: {
    question: true;
  };
}>;

export const CreateQuizSchema = z.object({
  title: z.string().min(1).max(255),
  questions: z
    .array(
      z.object({
        enunciation: z.string().min(1).max(255),
        sequence: z.number().int().default(0),
        options: z.array(
          z.object({
            enunciation: z.string().min(1).max(255),
            correct: z.boolean(),
          }),
        ),
      }),
    )
    .min(1),
  author: z
    .custom<User>((value) => !value.id || !value.email, {
      message: "The author must be a valid user.",
    })
    .optional()
    .nullable(),
});

export type CreateQuizSchemaType = z.infer<typeof CreateQuizSchema>;

/**
 * Quiz repository
 */
export class QuizRepository extends Context.Tag("QuizRepository")<
  QuizRepository,
  {
    /**
     * Create a quiz.
     *
     * @param title The title of the quiz.
     * @param questions The questions of the quiz.
     * @returns An effect that creates a quiz.
     */
    createQuiz: (data: CreateQuizSchemaType) => Effect.Effect<Quiz>;
  }
>() {}

/**
 * Live quiz repository.
 */
export const PrismaQuizRepository = Layer.effect(
  QuizRepository,
  Effect.gen(function* () {
    const prisma = yield* (yield* PrismaClientProvider)();
    return QuizRepository.of({
      createQuiz(data) {
        return Effect.promise((signal) =>
          prisma.quiz
            .create({
              data: {
                title: data.title,
                questions: {
                  create: data.questions.map(
                    ({ enunciation, sequence, options }) => ({
                      enunciation,
                      sequence,
                      options: {
                        create: options.map(({ enunciation, correct }) => ({
                          correct,
                          enunciation,
                        })),
                      },
                    }),
                  ),
                },
              },
              include: {
                questions: {
                  include: {
                    options: true,
                  },
                },
              },
            })
            .then((result) => {
              if (signal.aborted) {
                throw new Error("Operation aborted");
              }
              return result;
            }),
        );
      },
    });
  }),
).pipe(Layer.provide(PrismaClientProviderLive));
