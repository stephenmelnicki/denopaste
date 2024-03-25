import { FreshContext } from "$fresh/server.ts";
import { Pirsch, PirschNodeApiClient } from "pirsch";

const pirsch = (function () {
  let client: PirschNodeApiClient;

  function initializeClient() {
    return new Pirsch({
      hostname: Deno.env.get("PIRSCH_HOSTNAME")!,
      accessToken: Deno.env.get("PIRSCH_TOKEN")!,
      protocol: "https",
    });
  }

  return function () {
    if (!client) {
      client = initializeClient();
    }

    return client;
  };
})();

export async function pageView(req: Request, ctx: FreshContext) {
  try {
    await pirsch().hit(pirsch().hitFromRequest(toPirschRequest(req, ctx)));
  } catch (err) {
    console.error("Error sending page view to Pirsch", err);
  }
}

export async function event(
  req: Request,
  ctx: FreshContext,
  name: string,
  meta?: Record<string, string>,
  duration?: number,
) {
  try {
    await pirsch().event(
      name,
      pirsch().hitFromRequest(toPirschRequest(req, ctx)),
      duration,
      meta,
    );
  } catch (err) {
    console.error("Error sending event to Pirsch", err);
  }
}

function toPirschRequest(req: Request, ctx: FreshContext) {
  return {
    url: req.url,
    socket: {
      // NOTE: Using fly.io specific header to get client ip
      remoteAddress: req.headers.get("fly-client-ip") ||
        ctx.remoteAddr.hostname,
    },
    headers: {
      dnt: req.headers.get("dnt"),
      "user-agent": req.headers.get("user-agent"),
      "accept-language": req.headers.get("accept-language"),
      referer: req.headers.get("referer"),
    },
  };
}
