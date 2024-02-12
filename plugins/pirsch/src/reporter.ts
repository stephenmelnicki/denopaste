import { type FreshContext } from "$fresh/server.ts";

import { Queue } from "@/plugins/pirsch/src/queue.ts";
import { PirschPluginOptions } from "@/plugins/pirsch/src/types.ts";

interface Reporter {
  (
    request: Request,
    context: FreshContext,
  ): void;
}

export function createReporter(options: PirschPluginOptions): Reporter {
  const {
    hostname = Deno.env.get("PIRSCH_HOSTNAME"),
    id = Deno.env.get("PIRSCH_CLIENT"),
    secret = Deno.env.get("PIRSCH_SECRET"),
    filter = () => true,
  } = options;

  if (!hostname || !id || !secret) {
    console.log(
      "PIRSCH_HOSTNAME, PIRSCH_CLIENT, and PIRSCH_SECRET environment variables not set. Pirsch reporting disabled.",
    );
  }

  const queue = new Queue(hostname, id, secret);

  return function report(
    request: Request,
    context: FreshContext,
  ) {
    if (!hostname || !id || !secret) {
      return;
    }

    if (!filter(request)) {
      return;
    }

    console.log(
      `${request.method.toUpperCase()} ${request.url} - ${context.remoteAddr.hostname}`,
    );
    queue.enqueue(request, context);
  };
}
