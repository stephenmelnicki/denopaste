import { FreshContext } from "fresh";
import { type State } from "../utils/define.ts";
import PasteDatabase from "../data/mod.ts";
import report from "../analytics/report.ts";
import { errorTitle } from "../utils/title.ts";
import { duration, log, path, Prefix } from "../utils/logger.ts";

export async function handler(ctx: FreshContext<State>): Promise<Response> {
  let err;
  let res: Response;
  const start = performance.now();

  log(Prefix.Incoming, ctx.req.method, path(ctx.req.url));

  try {
    ctx.state.db = await PasteDatabase.getInstance();
    const response = await ctx.next();
    const headers = new Headers(response.headers);
    res = new Response(response.body, { status: response.status, headers });
    return res;
  } catch (e: unknown) {
    ctx.state.title = errorTitle(e);
    res = new Response("Server error", { status: 500 });
    err = e;
    throw e;
  } finally {
    log(
      Prefix.Outgoing,
      ctx.req.method,
      path(ctx.req.url),
      res!.status,
      duration(start),
    );
    report(ctx.req, ctx, res!, start, err);
  }
}
