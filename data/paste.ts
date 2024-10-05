import { ulid } from "@std/ulid";

/**
 * Error object thrown when attempting to create an empty paste.
 */
export class PasteEmptyError extends Error {
  /** message indicating pastes can't be empty */
  override readonly message = "Paste can not be empty.";
}

/**
 * Error thrown when attempting to create a paste with contents that exceed
 * 64KiB in size.
 */
export class PasteTooLargeError extends Error {
  override readonly message = "Paste is too large. Size limit is 64 KiB.";
}

/**
 * An object representing the result of validating a paste's content.
 */
export type ValidationResult = {
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
   * @example Create a paste
   * ```ts
   * import { expect } from "jsr:@std/expect";
   *
   * const paste = new Paste("Hello, world!");
   * expect(paste.contents).toEqual("Hello, world!");
   * ```
   *
   * @example Throw paste empty error
   * ```ts
   * import { expect } from "jsr:@std/expect";
   *
   * try {
   *  new Paste("");
   * } catch (err) {
   *  expect(err).toBeInstanceOf(PasteEmptyError);
   * }
   * ```
   *
   * @example Throw paste too large error
   * ```ts
   * import { expect } from "jsr:@std/expect";
   *
   * try {
   *  new Paste("paste".repeat(1024 * 64));
   * } catch (err) {
   *  expect(err).toBeInstanceOf(PasteTooLargeError);
   * }
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

    if (new TextEncoder().encode(contents).length > 1024 * 64) {
      throw new PasteTooLargeError();
    }

    this.id = ulid();
    this.contents = contents;
    this.createdAt = new Date();
  }
}
