import { FreshContext, HttpError } from "fresh";
import { Pirsch, PirschHit, PirschNodeApiClient } from "pirsch";

export const getAnalytics: () => Analytics = (() => {
  let analytics: Analytics;

  return function () {
    if (!analytics) {
      analytics = new PirschReporter();
    }

    return analytics;
  };
})();

interface Analytics {
  trackPageView(
    req: Request,
    ctx: FreshContext,
    duration?: number,
  ): Promise<void>;

  trackPasteSubmission(
    req: Request,
    res: Response,
    ctx: FreshContext,
    duration?: number,
  ): Promise<void>;

  trackError(
    req: Request,
    ctx: FreshContext,
    error: unknown,
    duration?: number,
  ): Promise<void>;
}

class PirschReporter implements Analytics {
  private readonly pirsch: PirschNodeApiClient;

  constructor() {
    this.pirsch = new Pirsch({
      hostname: Deno.env.get("PIRSCH_HOSTNAME")!,
      accessToken: Deno.env.get("PIRSCH_TOKEN")!,
      protocol: "https",
    });
  }

  public async trackPageView(req: Request, ctx: FreshContext) {
    try {
      await this.pirsch.hit(this.requestToPirschHit(req, ctx));
    } catch (err) {
      console.error("Error tracking page view", err);
    }
  }

  public async trackPasteSubmission(
    req: Request,
    res: Response,
    ctx: FreshContext,
  ) {
    try {
      const id = res.headers.get("location")?.split("/").pop()!;
      const size = req.headers.get("content-length")!;

      const meta = {
        id,
        size: `${size} bytes`,
      };

      await this.pirsch.event(
        "Create Paste",
        this.requestToPirschHit(req, ctx),
        undefined,
        meta,
      );
    } catch (err) {
      console.error("Error tracking paste submission", err);
    }
  }

  public async trackError(
    req: Request,
    ctx: FreshContext,
    error: unknown,
  ) {
    const code = error instanceof HttpError ? error.status : 500;
    const name = this.getName(code);
    const meta = {
      code,
      method: req.method,
      url: req.url,
    };

    await this.pirsch.event(
      name,
      this.requestToPirschHit(req, ctx),
      undefined,
      meta,
    );
  }

  private requestToPirschHit(req: Request, ctx: FreshContext): PirschHit {
    return {
      url: req.url,
      ip: this.getClientIp(req, ctx),
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

  private getClientIp(req: Request, ctx: FreshContext): string {
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(/\s*,\s*/)[0];
    } else {
      return (ctx.info.remoteAddr as Deno.NetAddr).hostname;
    }
  }

  private getName(code: number) {
    if (code === 400) {
      return "400 Bad request";
    }

    if (code === 404) {
      return "404 Paste not found";
    }

    if (code === 413) {
      return "413 Paste too large";
    }

    return "500 Server error";
  }
}
