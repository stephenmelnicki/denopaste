import { FreshContext } from "fresh";
import { getAnalytics } from "../utils/analytics.ts";

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
  const analytics = getAnalytics();

  if (!analytics) {
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
    analytics.trackPageView(request, conn, start);
  }

  if (request.method === "POST" && error == null) {
    analytics.trackPasteSubmission(request, response, conn, start);
  }

  if (error != null) {
    analytics.trackError(request, conn, error, start);
  }
}

export async function handler(ctx: FreshContext): Promise<Response> {
  let err;
  let res: Response;
  const start = performance.now();

  try {
    const response = await ctx.next();
    const headers = new Headers(response.headers);
    res = new Response(response.body, { status: response.status, headers });
    return res;
  } catch (e) {
    res = new Response("Server error", { status: 500 });
    err = e;
    throw e;
  } finally {
    pirsch(ctx.req, ctx, res!, start, err);
  }
}
