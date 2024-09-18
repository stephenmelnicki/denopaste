import { ulid } from "@std/ulid";

/**
 * Error object thrown when attempting to create an empty paste.
 */
export class PasteEmptyError extends Error {
  /** message indicating pastes can't be empty */
  readonly message = "Paste can not be empty.";
}

/**
 * Error thrown when attempting to create a paste with contents that exceed
 * 64KiB in size.
 */
export class PasteTooLargeError extends Error {
  readonly message = "Paste is too large. Size limit is 64 KiB.";
}

/**
 * An object representing the result of validating a paste's content.
 */
type ValidationResult = {
  /** A boolean indicating whether validation was successful. */
  ok: boolean;
  /** A message describing why validation failed. */
  message: string;
};

/**
 * An object representing a paste, including its unique identifier, contents,
 * and the date it was created on.
 */
export default class Paste {
  /** The unique identifier of the paste. */
  readonly id: string;
  /** The contents of the paste. */
  readonly contents: string;
  /** The date and time of when the paste was created. */
  readonly createdAt: Date;

  /**
   * Creates a new paste with the given contents.
   *
   * @example
   * ```ts
   * import Paste from "./paste.ts";
   *
   * const paste = new Paste("Hello, world!");
   * paste; // { id: "01J7S8N4X7TMC8KP8XVJW08NJM", contents: "Hello, world!", createdAt: 2021-09-01T00:00:00.000Z }
   * const empty = new Paste(""); // throws PasteEmptyError
   * const tooLong = new Paste("A".repeat(1024 * 64 + 1)); // throws PasteTooLongError
   * ```
   *
   * @param contents The text contents of the paste.
   * @throws {PasteEmptyError} If the contents are empty.
   * @throws {PasteTooLargeError} If the contents exceed 64KB in size.
   */
  constructor(contents: string) {
    if (contents.trim().length === 0) {
      throw new PasteEmptyError();
    }

    if (new Blob([contents]).size > 1024 * 64) {
      throw new PasteTooLargeError();
    }

    this.id = ulid();
    this.contents = contents;
    this.createdAt = new Date();
  }

  /**
   * Validate the contents to be saved to a paste.
   *
   * @example Usage
   * ```ts
   * import Paste from "./paste.ts";
   *
   * const result = Paste.validate("Hello, world!");
   * result; // { ok: true, message: "" }
   *
   * const invalid = Paste.validate("");
   * invalid; // { ok: false, message: "Paste can not be empty." }
   *
   * const tooLarge = Paste.validate("A".repeat(1024 * 64 + 1));
   * tooLarge; // { ok: false, message: "Paste is too large. Size limit is 64 KiB." }
   * ```
   *
   * @param contents The text contents of the paste.
   * @returns An object with a boolean indicating whether the contents are valid
   * and a message if they are not.
   */
  static validate(contents: string): ValidationResult {
    try {
      new Paste(contents);
      return { ok: true, message: "" };
    } catch (err: unknown) {
      if (err instanceof PasteEmptyError || err instanceof PasteTooLargeError) {
        return { ok: false, message: err.message };
      }

      throw err;
    }
  }
}
