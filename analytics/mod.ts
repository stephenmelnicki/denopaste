import { FreshContext, HttpError } from "fresh";
import { Pirsch, PirschHit, PirschNodeApiClient } from "pirsch";

let reporterInstance: PirschReporter | undefined;

export default class PirschReporter {
  private readonly pirsch: PirschNodeApiClient;

  constructor(hostname: string, accessToken: string) {
    this.pirsch = new Pirsch({
      hostname,
      accessToken,
      protocol: "https",
    });
  }

  public async pageView(req: Request, ctx: FreshContext): Promise<void> {
    try {
      await this.pirsch.hit(this.createHit(req, ctx));
    } catch (err) {
      console.error("error tracking page view", err);
    }
  }

  public async pasteEvent(
    req: Request,
    res: Response,
    ctx: FreshContext,
  ): Promise<void> {
    try {
      const hit = this.createHit(req, ctx);
      const meta = {
        id: `${res.headers.get("location")?.split("/").pop()!}`,
        size: `${req.headers.get("content-length") ?? 0} bytes`,
      };

      await this.pirsch.event("Create Paste", hit, undefined, meta);
    } catch (err) {
      console.error("error tracking paste event", err);
    }
  }

  public async errorEvent(
    req: Request,
    ctx: FreshContext,
    error: unknown,
  ): Promise<void> {
    const code = error instanceof HttpError ? error.status : 500;
    const name = this.getNameFromCode(code);
    const meta = {
      code,
      method: req.method,
      url: req.url,
    };

    try {
      console.log("logging error event...");
      await this.pirsch.event(
        name,
        this.createHit(req, ctx),
        undefined,
        meta,
      );
    } catch (err) {
      console.error("error tracking error event", err);
    }
  }

  static getInstance(): PirschReporter | undefined {
    const hostname = Deno.env.get("PIRSCH_HOSTNAME");
    const accessToken = Deno.env.get("PIRSCH_ACCESS_TOKEN");

    if (!hostname || !accessToken) {
      console.warn(
        '"PIRSCH_HOSTNAME" and "PIRSCH_ACCESS_TOKEN" environment variables not set. Pirsch analytics reporting disabled.',
      );
      return undefined;
    }

    if (!reporterInstance) {
      console.log("connecting to pirsch analytics...");
      reporterInstance = new PirschReporter(hostname, accessToken);
      console.log("connected.");
    }

    return reporterInstance;
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

  private getNameFromCode(code: number): string {
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
