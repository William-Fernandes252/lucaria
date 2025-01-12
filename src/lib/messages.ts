import { GenerationError } from "@/lib/errors";
import type { CoreMessage } from "ai";
import { Context, Effect, Layer } from "effect";
import { z } from "zod";
import {
  URLValidator,
  URLValidatorLive,
  WordCounter,
  WordCounterLive,
} from "./parsers";

export const InputSchema = z.object({
  text: z
    .string()
    .nonempty()
    .trim()
    .describe("The text input to generate the quiz from."),
  questions: z
    .number({ coerce: true })
    .positive({
      message: "The amount of questions must be a positive integer.",
    })
    .min(1, { message: "The amount of questions must be at least 1." })
    .describe("The amount of questions in the quiz."),
});

export type Input = z.infer<typeof InputSchema>;

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

/**
 * Message builder.
 *
 * This service is responsible for building messages from user input.
 *
 * The messages are used to guide the user through the quiz generation process.
 */
export class MessageBuilder extends Context.Tag("MessageBuilder")<
  MessageBuilder,
  {
    /**
     * Build messages for an user input.
     *
     * @param input The user input.
     * @returns An effect with the messages to guide the generation process.
     */
    buildForInput: (
      input: Input,
    ) => Effect.Effect<CoreMessage[], GenerationError>;
  }
>() {}

const MessageBuilderConfigLive = Layer.merge(WordCounterLive, URLValidatorLive);

/**
 * Live message builder.
 */
export const MessageBuilderLive = Layer.effect(
  MessageBuilder,
  Effect.gen(function* () {
    const counter = yield* WordCounter;
    const urlValidator = yield* URLValidator;
    return MessageBuilder.of({
      buildForInput: (input: Input) =>
        Effect.gen(function* () {
          const refinement = [
            {
              role: "user",
              content:
                "Do not enumerate or label the answer options as A, B, C etc.",
            },
          ] as CoreMessage[];

          if (yield* urlValidator.validate(input.text)) {
            yield* Effect.fail(
              new GenerationError({ message: "URLs are not yet supported." }),
            );
          }

          const count = yield* counter.count(input.text);
          if (count === 1) {
            return [
              {
                role: "user",
                content: `Generate a quiz about "${input.text}". with ${input.questions} questions.`,
              },
              ...refinement,
            ];
          }
          return [
            {
              role: "user",
              content: `Generate a quiz with ${input.questions} questions from the following text:`,
            },
            {
              role: "user",
              content: input.text,
            },
            ...refinement,
          ];
        }),
    });
  }),
).pipe(Layer.provide(MessageBuilderConfigLive));
