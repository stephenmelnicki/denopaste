import { FreshContext, HttpError } from "fresh";
import { PirschHit, PirschNodeApiClient } from "pirsch";

/**
 * Reports a page hit event to the Pirsch client.
 *
 * @param client The Pirsch client
 */
export async function hit(
  client: PirschNodeApiClient,
  ctx: FreshContext,
) {
  await client.hit(createHit(ctx));
}

/**
 * Reports a paste creation event to the Pirsch client.
 *
 * @param client The Pirsch client
 * @param req The incoming request
 * @param res The outgoing response
 * @param ctx The Fresh context
 */
export async function pasteEvent(
  client: PirschNodeApiClient,
  ctx: FreshContext,
  res: Response,
) {
  const metadata = {
    id: `${res.headers.get("location")?.split("/").pop()!}`,
    size: `${ctx.req.headers.get("content-length") ?? 0} bytes`,
  };

  await client.event(
    "Create Paste",
    createHit(ctx),
    undefined,
    metadata,
  );
}

/**
 * Reports an error event to the Pirsch client.
 *
 * @param client The Pirsch client
 * @param req The incoming request
 * @param ctx The Fresh context
 * @param err The error that occurred
 */
export async function errorEvent(
  client: PirschNodeApiClient,
  ctx: FreshContext,
) {
  const code = ctx.error instanceof HttpError ? ctx.error.status : 500;
  const metadata = {
    code,
    method: ctx.req.method,
    url: ctx.req.url,
  };

  await client.event(
    getNameFromErrorCode(code),
    createHit(ctx),
    undefined,
    metadata,
  );
}

function createHit(ctx: FreshContext): PirschHit {
  const { req, info } = ctx;
  const { url, headers } = req;

  return {
    url,
    ip: (info.remoteAddr as Deno.NetAddr).hostname,
    user_agent: headers.get("user-agent") || "unknown",
    accept_language: headers.get("accept-language") || undefined,
    sec_ch_ua: headers.get("sec-ch-ua") || undefined,
    sec_ch_ua_mobile: headers.get("sec-ch-ua-mobile") || undefined,
    sec_ch_ua_platform: headers.get("sec-ch-ua-platform") || undefined,
    sec_ch_ua_platform_version: headers.get("sec-ch-ua-platform-version") ||
      undefined,
    sec_ch_width: headers.get("sec-ch-width") || undefined,
    sec_ch_viewport_width: headers.get("sec-ch-viewport-width") ||
      undefined,
    referrer: headers.get("referer") || undefined,
  };
}

function getNameFromErrorCode(code: number): string {
  switch (code) {
    case 400:
      return "400 Bad request";
    case 404:
      return "404 Paste not found";
    case 413:
      return "413 Paste too large";
    default:
      return "500 Server error";
  }
}
