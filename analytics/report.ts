import { FreshContext } from "fresh";
import { error } from "@std/log/error";

import PirschReporter from "./mod.ts";

function isPage(req: Request) {
  return !req.url.includes(".ico") &&
    !req.url.includes(".woff2") &&
    !req.url.includes(".css") &&
    !req.url.includes(".js");
}

export default function report(
  request: Request,
  conn: FreshContext,
  response: Response,
  err?: unknown,
) {
  const reporter = PirschReporter.getInstance();

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
    error(err);
    reporter.errorEvent(request, conn, err);
  }

  if (conn.error != null) {
    error(conn.error);
    reporter.errorEvent(request, conn, conn.error);
  }

  if (request.method === "GET") {
    reporter.pageView(request, conn);
  }

  if (request.method === "POST") {
    reporter.pasteEvent(request, response, conn);
  }
}
