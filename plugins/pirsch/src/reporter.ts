import { type FreshContext } from "$fresh/server.ts";
import { Pirsch, PirschHit, PirschNodeApiClient } from "pirsch";

import { Queue } from "@/plugins/pirsch/src/queue.ts";
import { PirschPluginOptions } from "@/plugins/pirsch/src/types.ts";

export interface Reporter {
  (
    request: Request,
    context: FreshContext,
  ): void;
}

function createHit(request: Request, context: FreshContext): PirschHit {
  return {
    url: request.url,
    ip: context.remoteAddr.hostname,
    user_agent: request.headers.get("user-agent")!,
    accept_language: request.headers.get("accept-language") || undefined,
    referrer: request.headers.get("referrer") || undefined,
  } as PirschHit;
}

export function createReporter(options: PirschPluginOptions): Reporter {
  const client: PirschNodeApiClient = new Pirsch({
    hostname: options.hostname,
    clientId: options.id,
    clientSecret: options.secret,
  });

  const queue = new Queue(client);

  return function report(
    request: Request,
    context: FreshContext,
  ) {
    const hit = createHit(request, context);
    console.log(JSON.stringify(hit, null, 2));
    queue.enqueue(hit);
  };
}
