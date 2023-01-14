import { assertEquals } from "$std/testing/asserts.ts";
import { CHARS, generateId, LENGTH } from "./random.ts";

Deno.test("generateId", () => {
  const ids = Array.from({ length: 10 }, (_, key) => key).map(() =>
    generateId()
  );

  const result = ids.every((id) => {
    return id.length === LENGTH &&
      id.split("").every((char) => CHARS.includes(char));
  });

  assertEquals(result, true);
});
