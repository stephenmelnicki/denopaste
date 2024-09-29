import { FreshContext, HttpError } from "fresh";
import { type State } from "../utils/define.ts";
import PasteDatabase from "../data/mod.ts";
import report from "../analytics/report.ts";
import { errorTitle } from "../utils/title.ts";
import { duration, error, log, path, Prefix } from "../utils/logger.ts";

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
    if (e instanceof HttpError) {
      res = new Response(e.message, { status: e.status });
    } else {
      res = new Response("Server error", { status: 500 });
    }

    ctx.state.title = errorTitle(e);
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

    if (err && err instanceof Error) {
      error(
        ctx.req.method,
        path(ctx.req.url),
        res!.status,
        err.message,
        err.stack,
      );
    }

    report(ctx.req, ctx, res!, err);
  }
}
