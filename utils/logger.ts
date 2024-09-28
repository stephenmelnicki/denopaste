import { info } from "@std/log";

export enum Prefix {
  Incoming = "<--",
  Outgoing = "-->",
}

export function log(
  prefix: Prefix,
  method: string,
  path: string,
  status?: number,
  duration?: string,
) {
  const message = prefix === Prefix.Incoming
    ? `${prefix} ${method} ${path}`
    : `${prefix} ${method} ${path} ${status} ${duration}`;

  info(message);
}

export function path(url: string): string {
  return new URL(url).pathname;
}

export function duration(start: number): string {
  const delta = performance.now() - start;

  return delta < 1000
    ? `${delta.toFixed(2)}ms`
    : `${Math.round(delta / 1000)}s`;
}
