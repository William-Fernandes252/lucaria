import { Schema } from "effect";

/**
 * Schema for questions amount.
 */
export const QuestionsSchema = Schema.Positive.annotations({
  description: "The amount of questions in the quiz.",
  examples: [5, 10],
  message: () => "The amount of questions must be a positive integer.",
}).pipe(Schema.greaterThanOrEqualTo(1));

/**
 * Schema for a quiz theme.
 */
export const ThemeSchema = Schema.String.annotations({
  description: "A theme for a quiz.",
  examples: ["Next.js", "Vite"],
  message: () => "The theme must be alphanumeric.",
}).pipe(Schema.minLength(2), Schema.maxLength(50), Schema.trimmed());

/**
 * Schema for a quiz keywords.
 */
export const KeywordsSchema = Schema.Array(Schema.String)
  .annotations({
    description: "Keywords for a quiz.",
    examples: [["React", "TypeScript"], ["JavaScript"]],
    message: () => "The keywords must be alphanumeric.",
  })
  .pipe(Schema.maxItems(10), Schema.minItems(2));

export const URLSchema = Schema.URL.annotations({
  description: "A URL.",
  examples: [new URL("https://example.com")],
});

/**
 * Schema for quiz generation result.
 */
export const QuizGenerationResult = Schema.Struct({
  title: Schema.String.annotations({
    description: "The title of the quiz.",
    examples: ["Next.js Quiz", "Vite Quiz"],
  }),
  questions: Schema.Array(
    Schema.Struct({
      question: Schema.String.annotations({
        description: "The question.",
        examples: ["What is React?", "What is Vite?"],
      }),
      options: Schema.Array(Schema.String).annotations({
        description: "The possible answers.",
        examples: [
          [
            "A library for building user interfaces",
            "A framework for building user interfaces",
          ],
          ["A build tool", "A bundler"],
        ],
      }),
      correct: Schema.Int.annotations({
        description: "The index of the correct answer.",
        examples: [0, 1],
      }),
    }),
  ).annotations({
    description: "The questions in the quiz.",
    examples: [
      [
        {
          question: "What is React?",
          options: [
            "A library for building user interfaces",
            "A framework for building user interfaces",
          ],
          correct: 1,
        },
        {
          question: "What is Vite?",
          options: ["A build tool", "A bundler"],
          correct: 0,
        },
      ],
    ],
  }),
});
