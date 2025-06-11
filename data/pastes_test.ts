import { expect } from "@std/expect";
import { ulid } from "@std/ulid";

import {
  addPaste,
  createPaste,
  getPasteById,
  PasteEmptyError,
  PasteTooLargeError,
} from "./pastes.ts";

Deno.test("createPaste creates a new paste with provided contents", () => {
  const contents = "Hello, world!";
  const paste = createPaste(contents);

  expect(paste.contents).toEqual(contents);
  expect(paste.id).toBeDefined();
  expect(paste.createdAt).toBeDefined();
});

Deno.test("createPaste throws 'PasteEmptyError' when contents are empty", () => {
  expect(() => createPaste("")).toThrow(PasteEmptyError);
  expect(() => createPaste("  ")).toThrow(PasteEmptyError);
});

Deno.test("createPaste throws 'PasteTooLargeError' error when contents exceed size limit of 64 KiB", () => {
  expect(() => createPaste("test".repeat(1024 * 64))).toThrow(
    PasteTooLargeError,
  );
});

Deno.test("getPasteById returns null when paste not found", async () => {
  const id = ulid();
  const result = await getPasteById(id);

  expect(result).toEqual(null);
});

Deno.test("addPaste adds paste to the database", async () => {
  const paste = createPaste("test");
  await addPaste(paste);
  const result = await getPasteById(paste.id);

  expect(result).toBeDefined();
  expect(result?.id).toEqual(paste.id);
  expect(result?.contents).toEqual(paste.contents);
  expect(result?.createdAt).toEqual(paste.createdAt);
});
