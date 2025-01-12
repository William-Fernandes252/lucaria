import { type Input, InputSchema } from "@/lib/messages";
import { QuizService, QuizServiceLive } from "@/services/quizzes";
import { Effect } from "effect";

/**
 * Generate a quiz.
 *
 * @param params The generation parameters.
 * @returns An effect with the generated quiz.
 */
export default function generateQuiz(params: unknown) {
  return Effect.provide(
    Effect.gen(function* () {
      const { success, error, data } = InputSchema.safeParse(params);
      if (!success) {
        yield* Effect.fail(error);
      }

      const quizGenerator = yield* QuizService;
      return yield* quizGenerator.generateQuiz(data as Input);
    }),
    QuizServiceLive,
  );
}
