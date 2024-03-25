import { FreshContext } from "$fresh/server.ts";
import { pageView } from "@/analytics/pirsch.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const resp = await ctx.next();

  if (shouldTrack(req)) {
    await pageView(req, ctx);
  }

  return resp;
}

function shouldTrack(req: Request) {
  return !req.url.includes(".ico") &&
    !req.url.includes(".woff2") &&
    !req.url.includes(".css") &&
    !req.url.includes(".js");
}
