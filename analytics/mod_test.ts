import { expect } from "@std/expect";
import { assertSpyCallArg, assertSpyCalls, stub } from "@std/testing/mock";

import PirschReporter from "./mod.ts";

Deno.test("PirschReporter.getInstance() returns undefined when no hostname or token is provided", () => {
  using _ = stub(console, "warn");

  const reporter = PirschReporter.getInstance();
  expect(reporter).toBeUndefined();
});

Deno.test("PirschReporter.getInstance() logs warning to console when no hostname or access token is provided", () => {
  using consoleStub = stub(console, "warn");

  const reporter = PirschReporter.getInstance();

  expect(reporter).toBeUndefined();
  assertSpyCalls(consoleStub, 1);
  assertSpyCallArg(
    consoleStub,
    0,
    0,
    '"PIRSCH_HOSTNAME" and "PIRSCH_ACCESS_TOKEN" environment variables not set. Pirsch analytics reporting disabled.',
  );
});
