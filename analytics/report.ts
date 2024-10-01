import { FreshContext } from "fresh";
import { getReporter } from "./mod.ts";

function isPage(req: Request) {
  return !req.url.includes(".ico") &&
    !req.url.includes(".woff2") &&
    !req.url.includes(".css") &&
    !req.url.includes(".js");
}

export default function report(
  request: Request,
  ctx: FreshContext,
  response: Response,
  err?: unknown,
) {
  const reporter = getReporter();

  if (!reporter) {
    return;
  }

  // track only page views and paste submissions
  if (!["GET", "POST"].includes(request.method)) {
    return;
  }

  // no need to track asset requests like css, fonts, images, etc.
  if (!isPage(request)) {
    return;
  }

  if (err != null) {
    reporter.errorEvent(request, ctx, err);
  } else if (ctx.error != null) {
    reporter.errorEvent(request, ctx, ctx.error);
  }

  if (request.method === "GET") {
    reporter.pageView(request, ctx);
  }

  if (request.method === "POST") {
    reporter.pasteEvent(request, response, ctx);
  }
}
