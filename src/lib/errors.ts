import { Data } from "effect";

/**
 * Generation error. This error is thrown when a quiz cannot be generated.
 */
export class GenerationError extends Data.Error<{
  message: string;
  cause?: unknown;
}> {
  readonly _tag = "GenerationError";
}
