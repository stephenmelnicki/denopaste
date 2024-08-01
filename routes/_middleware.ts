import { FreshContext } from "fresh";
import { type State } from "../utils/define.ts";
import { analytics } from "../utils/analytics.ts";
import { database } from "../utils/db.ts";
import { errorTitle } from "../utils/title.ts";

function isPage(req: Request) {
  return !req.url.includes(".ico") &&
    !req.url.includes(".woff2") &&
    !req.url.includes(".css") &&
    !req.url.includes(".js");
}

function pirsch(
  request: Request,
  conn: FreshContext,
  response: Response,
  start: number,
  error?: unknown,
) {
  const pirsch = analytics();

  if (!pirsch) {
    return;
  }

  // track page views and paste submissions
  if (!["GET", "POST"].includes(request.method)) {
    return;
  }

  // no need to track asset requests like css, fonts, images, etc.
  if (!isPage(request)) {
    return;
  }

  if (request.method === "GET" && error == null) {
    pirsch.pageView(request, conn, start);
  }

  if (request.method === "POST" && error == null) {
    pirsch.pasteEvent(request, response, conn, start);
  }

  if (error != null) {
    pirsch.errorEvent(request, conn, error, start);
  }
}

export async function handler(ctx: FreshContext<State>): Promise<Response> {
  let err;
  let res: Response;
  const start = performance.now();

  try {
    ctx.state.db = await database();
    const response = await ctx.next();
    const headers = new Headers(response.headers);
    res = new Response(response.body, { status: response.status, headers });
    return res;
  } catch (e: unknown) {
    ctx.state.title = errorTitle(e as Error);
    res = new Response("Server error", { status: 500 });
    err = e;
    throw e;
  } finally {
    pirsch(ctx.req, ctx, res!, start, err);
  }
}
