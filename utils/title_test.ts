import { expect } from "@std/expect";
import { createTitle } from "./title.ts";

Deno.test("string is untouched when under 64 characters long", () => {
  const result = createTitle("Hello, world!");
  expect(result).toEqual("Hello, world! | Denopaste");
});

Deno.test("string is truncated when over 64 characters long", () => {
  const input = Array.from({ length: 70 }).map((_) => "a").join("");
  const result = createTitle(input);
  const expected = Array.from({ length: 64 }).map((_) => "a").join("") +
    "… | Denopaste";
  expect(result).toEqual(expected);
});
