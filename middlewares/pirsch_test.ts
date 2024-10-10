import { assertSpyCallArgs, assertSpyCalls, stub } from "@std/testing/mock";

import pirsch from "./pirsch.ts";
import type { FreshContext } from "fresh";

Deno.test("reporter should warn if no hostname or access token has been provided", () => {
  using _ = stub(Deno.env, "get", () => undefined);
  using warn = stub(console, "warn");

  const middleware = pirsch();
  middleware({
    next: () => Promise.resolve(new Response()),
  } as unknown as FreshContext);

  assertSpyCalls(warn, 1);
  assertSpyCallArgs(warn, 0, [
    "PIRSCH_HOSTNAME and PIRSCH_ACCESS_TOKEN environment variables not set. Pirsch analytics reporting disabled.",
  ]);
});
