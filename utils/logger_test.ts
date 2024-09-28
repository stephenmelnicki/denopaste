import { expect } from "@std/expect";
import { stub } from "@std/testing/mock";
import { FakeTime } from "@std/testing/time";
import { duration, path } from "./logger.ts";

Deno.test("path(url) returns expected url pathname", () => {
  expect(path("https://denopaste.com/")).toEqual("/");
  expect(path("https://denopaste.com/foo/bar")).toEqual("/foo/bar");
});

Deno.test("duration(start) returns amount of time elapsed", () => {
  using time = new FakeTime();
  using _ = stub(performance, "now", () => time.now);

  const start = performance.now();
  time.tick(500);

  expect(duration(start)).toEqual("500.00ms");

  time.tick(500);
  expect(duration(start)).toEqual("1s");
});
