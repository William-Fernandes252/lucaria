import { z } from "zod";

/**
 * Schema for questions amount.
 */
export const QuestionsSchema = z
  .number()
  .positive({ message: "The amount of questions must be a positive integer." })
  .min(1, { message: "The amount of questions must be at least 1." })
  .describe("The amount of questions in the quiz.");

export type QuestionsType = z.infer<typeof QuestionsSchema>;

/**
 * Schema for a quiz theme.
 */
export const ThemeSchema = z
  .string()
  .min(2, { message: "The theme must have at least 2 characters." })
  .max(50, { message: "The theme must have at most 50 characters." })
  .trim()
  .regex(/^[a-zA-Z0-9\s]+$/, { message: "The theme must be alphanumeric." })
  .describe("A theme for a quiz.");

export type ThemeType = z.infer<typeof ThemeSchema>;

/**
 * Schema for a quiz keywords.
 */
export const KeywordsSchema = z
  .array(z.string())
  .min(2, { message: "The keywords must include at least 2 items." })
  .max(10, { message: "The keywords must include at most 10 items." })
  .describe("Keywords for a quiz.");

export type KeywordsType = z.infer<typeof KeywordsSchema>;

/**
 * Schema for a URL.
 */
export const URLSchema = z
  .string()
  .url({ message: "Must be a valid URL." })
  .describe("A URL.");

export type URLType = z.infer<typeof URLSchema>;

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

export type QuizGenerationResultType = z.infer<
  typeof QuizGenerationResultSchema
>;
