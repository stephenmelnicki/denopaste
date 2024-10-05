import { expect } from "@std/expect";
import { byteSize } from "./bytes.ts";

Deno.test("bytesSize returns size in bytes", () => {
  const bytes = byteSize("Hello, world!");
  expect(bytes).toEqual("13 Bytes");
});

Deno.test("bytesSize returns size in kilobytes", () => {
  const kilobytes = byteSize("A".repeat(1024));
  expect(kilobytes).toEqual("1.00 KB");
});
