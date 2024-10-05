import { assertSpyCallArgs, assertSpyCalls, stub } from "@std/testing/mock";

import reporter from "./reporter.ts";
import type { FreshContext } from "fresh";

Deno.test("reporter should warn if no hostname or access token has been provided", () => {
  const warn = stub(console, "warn");
  const _ = stub(Deno.env, "get", () => undefined);

  const middleware = reporter();
  middleware({
    next: () => Promise.resolve(new Response()),
  } as unknown as FreshContext);

  assertSpyCalls(warn, 1);
  assertSpyCallArgs(warn, 0, [
    "PIRSCH_HOSTNAME and PIRSCH_ACCESS_TOKEN environment variables not set. Pirsch analytics reporting disabled.",
  ]);
});
