import { expect } from "@std/expect";
import Paste, { PasteEmptyError, PasteTooLargeError } from "./paste.ts";

Deno.test("new Paste(contents) creates a new paste with provided contents", () => {
  const contents = "Hello, world!";
  const paste = new Paste(contents);

  expect(paste.contents).toEqual(contents);
  expect(paste.id).toBeDefined();
  expect(paste.createdAt).toBeDefined();
});

Deno.test("new Paste(contents) throws 'PasteEmptyError' when contents are empty", () => {
  expect(() => new Paste("")).toThrow(PasteEmptyError);
});

Deno.test("new Paste(contents) throws 'PasteTooLargeError' error when contents are too long", () => {
  const longContents = "a".repeat(1024 * 64 + 1);
  expect(() => new Paste(longContents)).toThrow(PasteTooLargeError);
});

Deno.test("Paste.validate(contents) returns an ok result when contents are valid", () => {
  const result = Paste.validate("Hello, world!");

  expect(result.ok).toBe(true);
  expect(result.message).toBe("");
});

Deno.test("Paste.validate(contents) correctly indicates when contents are empty", () => {
  const result = Paste.validate("");

  expect(result.ok).toBe(false);
  expect(result.message).toBe("Paste can not be empty.");
});

Deno.test("Paste.validate(contents) correctly indicates when contents are too large", () => {
  const result = Paste.validate("A".repeat(1024 * 64 + 1));

  expect(result.ok).toBe(false);
  expect(result.message).toBe("Paste is too large. Size limit is 64 KiB.");
});
