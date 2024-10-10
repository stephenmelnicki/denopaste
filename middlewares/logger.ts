import type { FreshContext, MiddlewareFn } from "fresh";

enum Prefix {
  Incoming = "<--",
  Outgoing = "-->",
}

export function duration(start: number): string {
  const delta = performance.now() - start;

  return delta < 1000
    ? `${Math.round(delta)}ms`
    : `${Math.round(delta / 1000)}s`;
}

export default function logger<T>(): MiddlewareFn<T> {
  return async function loggerMiddleware(
    ctx: FreshContext<T>,
  ): Promise<Response> {
    const { req, url } = ctx;
    console.info(`${Prefix.Incoming} ${req.method} ${url.pathname}`);

    const start = performance.now();
    const response = await ctx.next();

    console.info(
      `${Prefix.Outgoing} ${req.method} ${url.pathname} ${response.status} ${
        duration(start)
      }`,
    );

    return response;
  };
}
