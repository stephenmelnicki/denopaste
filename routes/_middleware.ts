import { FreshContext } from "$fresh/server.ts";

import { getDbInstance } from "@/utils/db.ts";
import { getAnalyticsInstance } from "@/utils/analytics.ts";
import { State } from "@/utils/types.ts";

export async function handler(req: Request, ctx: FreshContext<State>) {
  ctx.state.db = getDbInstance();
  ctx.state.analytics = getAnalyticsInstance();

  if (shouldTrack(req)) {
    await ctx.state.analytics.trackPageView(req);
  }

  return await ctx.next();
}

function shouldTrack(req: Request) {
  return !req.url.includes(".ico") &&
    !req.url.includes(".woff2") &&
    !req.url.includes(".css") &&
    !req.url.includes(".js");
}
