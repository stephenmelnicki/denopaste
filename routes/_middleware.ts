import { FreshContext } from "$fresh/server.ts";

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  console.log("url:", req.url);
  console.log("referrer:", req.referrer);
  console.log("headers:", req.headers);
  // console.log("user agent:", req.headers.get("user-agent"));
  // console.log("accept language:", req.headers.get("accept-language"));

  console.log("ip:", ctx.remoteAddr.hostname);
  return await ctx.next();
}
