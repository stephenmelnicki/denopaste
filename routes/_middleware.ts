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
  _start: number,
  _error?: unknown,
) {
  const analytics = getAnalytics();

  if (request.url === "/" && request.method === "POST") {
    const id = response.headers.get("location")?.split("/").pop()!;
    const size = request.headers.get("content-length");

    analytics.trackEvent(request, conn, "Create Paste", {
      id,
      size: `${size} bytes`,
    });
  }

  if (isPage(request)) {
    analytics.trackPageView(request, conn);
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
