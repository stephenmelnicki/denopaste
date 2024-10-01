import { FreshContext, HttpError } from "fresh";
import { Pirsch, PirschHit, PirschNodeApiClient } from "pirsch";
import { error, path, warn } from "../utils/logger.ts";

export interface PirschReporter {
  pageView(req: Request, ctx: FreshContext): Promise<void>;
  pasteEvent(req: Request, res: Response, ctx: FreshContext): Promise<void>;
  errorEvent(req: Request, ctx: FreshContext, err: unknown): Promise<void>;
}

export const getReporter: () => PirschReporter | undefined = (() => {
  let reporter: PirschReporter | undefined;

  return () => {
    if (!reporter) {
      const hostname = Deno.env.get("PIRSCH_HOSTNAME");
      const accessToken = Deno.env.get("PIRSCH_ACCESS_TOKEN");

      if (!hostname || !accessToken) {
        warn(
          '"PIRSCH_HOSTNAME" and "PIRSCH_ACCESS_TOKEN" environment variables not set. Analytics reporting disabled.',
        );

        return undefined;
      }

      const client = new Pirsch({
        hostname,
        accessToken,
        protocol: "https",
      });

      reporter = new Reporter(client);
    }

    return reporter;
  };
})();

export class Reporter implements PirschReporter {
  readonly #pirsch: PirschNodeApiClient;

  constructor(client: PirschNodeApiClient) {
    this.#pirsch = client;
  }

  async pageView(req: Request, ctx: FreshContext): Promise<void> {
    const apiError = await this.#pirsch.hit(this.createHit(req, ctx));

    if (apiError) {
      error(
        req.method,
        path(req.url),
        apiError.code,
        apiError.message,
        apiError.stack,
      );
    }
  }

  async pasteEvent(
    req: Request,
    res: Response,
    ctx: FreshContext,
  ): Promise<void> {
    const apiError = await this.#pirsch.event(
      "Create Paste",
      this.createHit(req, ctx),
      undefined,
      {
        id: `${res.headers.get("location")?.split("/").pop()!}`,
        size: `${req.headers.get("content-length") ?? 0} bytes`,
      },
    );

    if (apiError) {
      error(
        req.method,
        path(req.url),
        apiError.code,
        apiError.message,
        apiError.stack,
      );
    }
  }

  async errorEvent(
    req: Request,
    ctx: FreshContext,
    err: unknown,
  ): Promise<void> {
    const code = err instanceof HttpError ? err.status : 500;

    const apiError = await this.#pirsch.event(
      this.getNameFromErrorCode(code),
      this.createHit(req, ctx),
      undefined,
      {
        code,
        method: req.method,
        url: req.url,
      },
    );

    if (apiError) {
      error(
        req.method,
        path(req.url),
        apiError.code,
        apiError.message,
        apiError.stack,
      );
    }
  }

  private createHit(req: Request, ctx: FreshContext): PirschHit {
    return {
      url: req.url,
      ip: (ctx.info.remoteAddr as Deno.NetAddr).hostname,
      user_agent: req.headers.get("user-agent") || "",
      accept_language: req.headers.get("accept-language") || undefined,
      sec_ch_ua: req.headers.get("sec-ch-ua") || undefined,
      sec_ch_ua_mobile: req.headers.get("sec-ch-ua-mobile") || undefined,
      sec_ch_ua_platform: req.headers.get("sec-ch-ua-platform") || undefined,
      sec_ch_ua_platform_version:
        req.headers.get("sec-ch-ua-platform-version") || undefined,
      sec_ch_width: req.headers.get("sec-ch-width") || undefined,
      sec_ch_viewport_width: req.headers.get("sec-ch-viewport-width") ||
        undefined,
      referrer: req.headers.get("referer") || undefined,
    };
  }

  private getNameFromErrorCode(code: number): string {
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
}
