import { FreshContext } from "fresh";
import { define } from "../utils/define.ts";

enum Prefix {
  Incoming = "<--",
  Outgoing = "-->",
}

function log(
  prefix: Prefix,
  method: string,
  path: string,
  status?: number,
  duration?: string,
) {
  const message = prefix === Prefix.Incoming
    ? `  ${prefix} ${method} ${path}`
    : `  ${prefix} ${method} ${path} ${status} ${duration}`;

  console.log(message);
}

function path(url: string): string {
  return new URL(url).pathname;
}

function duration(start: number): string {
  const delta = performance.now() - start;

  return delta < 1000
    ? `${delta.toFixed(2)}ms`
    : `${Math.round(delta / 1000)}s`;
}

async function logger(ctx: FreshContext): Promise<Response> {
  let res: Response;
  const start = performance.now();

  try {
    log(Prefix.Incoming, ctx.req.method, path(ctx.req.url));
    const { body, status, headers } = await ctx.next();
    res = new Response(body, { status, headers });
    return res;
  } catch (e) {
    res = new Response("Server Error", { status: 500 });
    throw e;
  } finally {
    log(
      Prefix.Outgoing,
      ctx.req.method,
      path(ctx.req.url),
      res!.status,
      duration(start),
    );
  }
}

export default define.middleware(logger);
