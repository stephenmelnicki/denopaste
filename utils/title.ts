import { HttpError } from "fresh";

/**
 * Create a page title from the paste contents. If the contents are longer than
 * 64 characters, they will be truncated.
 *
 * @example
 * ```ts
 * import { expect } from "@std/expect";
 *
 * expect(pageTitle("Hello, world!")).toEqual("Hello, world! | Deno Paste");
 * expect(pageTitle("A".repeat(70))).toEqual(`${"A".repeat(64)}... | Deno Paste`);
 * ```
 *
 * @param contents The contents to create a title from
 * @returns The page title
 */
export function pageTitle(contents: string): string {
  const truncated = contents.length > 64
    ? `${contents.substring(0, 64)}...`
    : contents;

  return title(truncated);
}

/**
 * Create an error title from the given error. If the error is an HttpError, a
 * descriptive message based on the status code will be returned. Otherwise, a
 * generic "Server error" message will be returned.
 *
 * @example
 * ```ts
 * import { expect } from "@std/expect";
 * import { HttpError } from "fresh";
 *
 * expect(errorTitle(new HttpError(400))).toEqual("Bad request | Deno Paste");
 * expect(errorTitle(new HttpError(404))).toEqual("Not found | Deno Paste");
 * expect(errorTitle(new HttpError(413))).toEqual("Payload too large | Deno Paste");
 * expect(errorTitle(new Error())).toEqual("Server error | Deno Paste");
 * ```
 *
 * @param error The error to create a title from
 * @returns The error title
 */
export function errorTitle(error: unknown): string {
  return error instanceof HttpError
    ? title(message(error.status))
    : title(message(500));
}

function title(contents: string): string {
  return `${contents} | Deno Paste`;
}

function message(status: number): string {
  switch (status) {
    case 400:
      return "Bad request";
    case 404:
      return "Not found";
    case 413:
      return "Payload too large";
    default:
      return "Server error";
  }
}
