import { expect } from "@std/expect";
import { HttpError } from "fresh";

import { errorTitle, pageTitle } from "./title.ts";

Deno.test("pageTitle returns default title when no contents are provided", () => {
  expect(pageTitle()).toEqual(
    "Deno Paste: A simple plain text storage service built with Deno 🦕 and Fresh 🍋",
  );
});

Deno.test("pageTitle leaves contents untouched when under 64 chars long", () => {
  const title = "Hello, world!";
  expect(pageTitle(title)).toEqual(`${title} | Deno Paste`);
});

Deno.test("pageTitle truncates content when over 64 chars long", () => {
  const input = "a".repeat(70);
  expect(pageTitle(input)).toEqual(`${input.substring(0, 64)}... | Deno Paste`);
});

Deno.test("errorTitle returns status title for HttpError type errors", () => {
  expect(errorTitle(new HttpError(400))).toEqual("Bad request | Deno Paste");
  expect(errorTitle(new HttpError(404))).toEqual("Not found | Deno Paste");
  expect(errorTitle(new HttpError(413))).toEqual(
    "Payload too large | Deno Paste",
  );
});

Deno.test("errorTitle returns generic status title for other error types", () => {
  expect(errorTitle(new Error())).toEqual("Server error | Deno Paste");
});
