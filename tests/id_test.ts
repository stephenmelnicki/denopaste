import { assertEquals, assertMatch } from "$std/assert/mod.ts";
import { createId } from "utils/id.ts";

Deno.test("returns a string of length 8 by default", () => {
  const id = createId();
  assertEquals(id.length, 8);
});

Deno.test("returns a string of custom length when specified", () => {
  const id = createId(12);
  assertEquals(id.length, 12);
});

Deno.test("returns a string containing letters and numbers", () => {
  const id = createId();
  assertMatch(id, /^[a-zA-Z0-9]+$/);
});
