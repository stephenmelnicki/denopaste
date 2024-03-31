import { FreshContext } from "$fresh/server.ts";

import { Db } from "@/utils/db.ts";
import { Analytics } from "@/utils/analytics.ts";
import { State } from "@/utils/types.ts";

export async function handler(req: Request, ctx: FreshContext<State>) {
  ctx.state.db = getDbInstance();
  ctx.state.analytics = getAnalyticsInstance();

  if (shouldTrack(req)) {
    await ctx.state.analytics.pageView(req);
  }

  return await ctx.next();
}

const getDbInstance = (function () {
  let database: Db;

  return function () {
    if (!database) {
      const path = Deno.env.get("DB_PATH") ?? "data/pastes.db";
      database = new Db(path);
    }

    return database;
  };
})();

const getAnalyticsInstance = (function () {
  let analytics: Analytics;

  return function () {
    if (!analytics) {
      analytics = new Analytics();
    }

    return analytics;
  };
})();

function shouldTrack(req: Request) {
  return !req.url.includes(".ico") &&
    !req.url.includes(".woff2") &&
    !req.url.includes(".css") &&
    !req.url.includes(".js");
}
