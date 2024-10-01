import { expect } from "@std/expect";
import { HttpError } from "fresh";

import { errorTitle, pageTitle } from "./title.ts";

Deno.test("pageTitle(str) leaves input untouched when under 64 chars long", () => {
  const title = "Hello, world!";
  expect(pageTitle(title)).toEqual(`${title} | Deno Paste`);
});

Deno.test("pageTitle(str) truncates when input is over 64 chars long", () => {
  const input = "a".repeat(70);
  expect(pageTitle(input)).toEqual(`${input.substring(0, 64)}... | Deno Paste`);
});

Deno.test("errorTitle(error) returns status title for HttpError", () => {
  expect(errorTitle(new HttpError(400))).toEqual("Bad request | Deno Paste");
  expect(errorTitle(new HttpError(404))).toEqual("Not found | Deno Paste");
  expect(errorTitle(new HttpError(413))).toEqual(
    "Payload too large | Deno Paste",
  );
});

Deno.test("errorTitle(error) returns generic title for non-HttpError", () => {
  expect(errorTitle(new Error())).toEqual(`Server error | Deno Paste`);
});
