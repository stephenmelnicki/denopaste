import { error as logError, info, warn as logWarning } from "@std/log";

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

export function warn(message: string) {
  logWarning(message);
}

export function error(
  method: string,
  path: string,
  status: number,
  message: string,
  stack?: string,
) {
  if (stack) {
    logError(`${method} ${path} ${status} ${message}`, stack);
  } else {
    logError(`${method} ${path} ${status} ${message}`);
  }
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
