import { HttpError } from "fresh";

export function pageTitle(str: string, length: number = 64): string {
  const truncated = str.length > length ? `${str.substring(0, length)}…` : str;
  return `${truncated} | Denopaste`;
}

function message(status: number): string {
  switch (status) {
    case 400:
      return "Bad request";
    case 404:
      return "Not found";
    case 413:
      return "Payload too large";
    default:
      return "Server error";
  }
}

export function errorTitle(error: unknown): string {
  return error instanceof HttpError
    ? `${message(error.status)} | Denopaste`
    : `${message(500)} | Denopaste`;
}
