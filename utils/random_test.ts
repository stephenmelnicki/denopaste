import { assertEquals } from "$std/testing/asserts.ts";
import { CHARS, generateEntryId, LENGTH } from "./random.ts";

Deno.test("generateEntryId", () => {
  const ids = Array.from({ length: 10 }, (_, key) => key).map(() =>
    generateEntryId()
  );

  const result = ids.every((id) => {
    return id.length === LENGTH &&
      id.split("").every((char) => CHARS.includes(char));
  });

  assertEquals(result, true);
});
