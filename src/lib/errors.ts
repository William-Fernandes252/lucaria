import { Data } from "effect";

/**
 * Base error for the application.
 */
export class BaseError extends Data.Error<{
  message: string;
  cause?: unknown;
  context?: unknown;
}> {}

/**
 * Generation error. This error is thrown when a quiz cannot be generated.
 */
export class GenerationError extends BaseError {
  readonly _tag = "GenerationError";
}
