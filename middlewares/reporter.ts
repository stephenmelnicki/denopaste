import { type MiddlewareFn } from "fresh";
import { Pirsch } from "pirsch";

import { errorEvent, hit, pasteEvent } from "../analytics/mod.ts";

const hostname = Deno.env.get("PIRSCH_HOSTNAME");
const accessToken = Deno.env.get("PIRSCH_ACCESS_TOKEN");

let showedMissingEnvWarning = false;

export default function reporter<T>(): MiddlewareFn<T> {
  return async function reporterMiddleware(ctx) {
    if (hostname === undefined || accessToken === undefined) {
      if (!showedMissingEnvWarning) {
        showedMissingEnvWarning = true;
        console.warn(
          "PIRSCH_HOSTNAME and PIRSCH_ACCESS_TOKEN environment variables not set. Pirsch analytics reporting disabled.",
        );
      }

      return await ctx.next();
    }

    const client = new Pirsch({
      hostname,
      accessToken,
      protocol: "https",
    });

    const response = await ctx.next();

    // track only page views and paste submissions
    if (!["GET", "POST"].includes(ctx.req.method)) {
      return response;
    }

    // no need to track asset requests like css, fonts, images, etc.
    if (
      [".css", ".js", ".ico", ".woff2"].some((ext) =>
        ctx.url.pathname.endsWith(ext)
      )
    ) {
      return response;
    }

    if (ctx.error != null) {
      errorEvent(client, ctx);
    }

    if (ctx.req.method === "GET") {
      hit(client, ctx);
    }

    if (ctx.req.method === "POST") {
      pasteEvent(client, ctx, response);
    }

    return response;
  };
}
