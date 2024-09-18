import { expect } from "@std/expect";
import { errorTitle, pageTitle } from "./title.ts";
import { HttpError } from "fresh";

Deno.test("pageTitle(str) leaves input untouched when under 64 chars long", () => {
  const title = "Hello, world!";
  expect(pageTitle(title)).toEqual(`${title} | Denopaste`);
});

Deno.test("pageTitle(str) truncates when input is over 64 chars long", () => {
  const input = "a".repeat(70);
  expect(pageTitle(input)).toEqual(`${input.substring(0, 64)}... | Denopaste`);
});

Deno.test("errorTitle(error) returns status title for HttpError", () => {
  expect(errorTitle(new HttpError(400))).toEqual("Bad request | Denopaste");
  expect(errorTitle(new HttpError(404))).toEqual("Not found | Denopaste");
  expect(errorTitle(new HttpError(413))).toEqual(
    "Payload too large | Denopaste",
  );
});

Deno.test("errorTitle(error) returns generic title for non-HttpError", () => {
  expect(errorTitle(new Error())).toEqual(`Server error | Denopaste`);
});
