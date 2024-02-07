import { FreshContext } from "$fresh/server.ts";

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  console.log(req.url);
  console.log(req.headers.get("user-agent"));
  console.log(ctx.remoteAddr.hostname);
  return await ctx.next();
}
