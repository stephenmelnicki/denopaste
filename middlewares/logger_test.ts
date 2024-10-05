import { expect } from "@std/expect";
import { assertSpyCallArgs, assertSpyCalls, stub } from "@std/testing/mock";
import { FakeTime } from "@std/testing/time";
import type { FreshContext } from "fresh";

import logger, { duration } from "./logger.ts";

Deno.test("duration(start) returns amount of time elapsed", () => {
  using time = new FakeTime();
  using _ = stub(performance, "now", () => time.now);

  const start = performance.now();
  time.tick(500);

  expect(duration(start)).toEqual("500ms");

  time.tick(500);
  expect(duration(start)).toEqual("1s");
});

Deno.test("logger() returns expected log message", async () => {
  using time = new FakeTime();
  using _ = stub(performance, "now", () => time.now);
  using info = stub(console, "info");

  const ctx = {
    req: new Request("https://denopaste.com/"),
    url: new URL("https://denopaste.com/"),
    next: () =>
      new Promise((r) => {
        time.tick(50);
        r(new Response("Hello, world!", { status: 200 }));
      }),
  } as FreshContext;

  const middleware = logger();
  await middleware(ctx);

  assertSpyCalls(info, 2);
  assertSpyCallArgs(info, 0, ["<-- GET /"]);
  assertSpyCallArgs(info, 1, ["--> GET / 200 50ms"]);
});
