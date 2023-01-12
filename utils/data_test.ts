import { assertEquals } from "$std/testing/asserts.ts";

import { MAX_PASTE_CHARACTERS } from "./data.ts";

Deno.test("MAX_PASTE_CHARACTERs", () => {
  assertEquals(MAX_PASTE_CHARACTERS, 2000);
});
