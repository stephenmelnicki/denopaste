import { expect } from "@std/expect";
import Paste, { PasteEmptyError, PasteTooLargeError } from "./paste.ts";

Deno.test("Paste constructor creates a new paste with provided contents", () => {
  const contents = "Hello, world!";
  const paste = new Paste(contents);

  expect(paste.contents).toEqual(contents);
  expect(paste.id).toBeDefined();
  expect(paste.createdAt).toBeDefined();
});

Deno.test("Paste constructor throws 'PasteEmptyError' when contents are empty", () => {
  expect(() => new Paste("")).toThrow(PasteEmptyError);
});

Deno.test("Paste constructor throws 'PasteTooLargeError' error when contents exceed size limit of 64 KiB", () => {
  const longContents = "paste".repeat(1024 * 64);
  expect(() => new Paste(longContents)).toThrow(PasteTooLargeError);
});

Deno.test("Paste.validate returns an ok result when contents are valid", () => {
  const result = Paste.validate("Hello, world!");

  expect(result.ok).toBe(true);
  expect(result.message).toBe("");
});

Deno.test("Paste.validate indicates when paste contents are empty", () => {
  const result = Paste.validate("");

  expect(result.ok).toBe(false);
  expect(result.message).toBe("Paste can not be empty.");
});

Deno.test("Paste.validate indicates when paste contents are too large", () => {
  const result = Paste.validate("paste".repeat(1024 * 64));

  expect(result.ok).toBe(false);
  expect(result.message).toEqual("Paste is too large. Size limit is 64 KiB.");
});
