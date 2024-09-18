import { expect } from "@std/expect";
import { assertSpyCallArg, assertSpyCalls, stub } from "@std/testing/mock";
import { FakeTime } from "@std/testing/time";
import { duration, log, path, Prefix } from "./logger.ts";

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

Deno.test("log(...) prints expected messages to the console", () => {
  using time = new FakeTime();
  using _ = stub(performance, "now", () => time.now);
  using consoleStub = stub(console, "log");

  log(Prefix.Incoming, "GET", path("https://denopaste.com/"));

  assertSpyCalls(consoleStub, 1);
  assertSpyCallArg(consoleStub, 0, 0, `  ${Prefix.Incoming} GET /`);

  const start = performance.now();
  time.tick(500);

  log(
    Prefix.Outgoing,
    "GET",
    path("https://denopaste.com/"),
    200,
    duration(start),
  );

  assertSpyCalls(consoleStub, 2);
  assertSpyCallArg(
    consoleStub,
    1,
    0,
    `  ${Prefix.Outgoing} GET / 200 500.00ms`,
  );
});
