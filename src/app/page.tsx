import { QuizGenerator, QuizGeneratorLive } from "@/services/generators";
import { Console, Effect } from "effect";

export default async function Home() {
  const program = Effect.provide(
    Effect.gen(function* () {
      const quizGenerator = yield* QuizGenerator;
      const result = yield* quizGenerator.generateFromTheme("React", 5);
      return result;
    }),
    QuizGeneratorLive,
  ).pipe(Effect.catchAll((error) => Console.error(error)));

  const message = await Effect.runPromise(program);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(message)}
    </main>
  );
}
